import { Injectable, NotFoundException } from '@nestjs/common';
import { Hotel, PrismaClient } from '@prisma/client';
import { CreateHotelDto } from './dto/createHotel.dto';
import { UpdateHotelDto } from './dto/updateHotel.dto';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaClient) {}
  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    try {
      const hotel = await this.prisma.hotel.create({
        data: {
          name: createHotelDto.name,
          address: createHotelDto.address,
          phoneNumber: createHotelDto.phoneNumber,
          stars: createHotelDto.stars,
          capacity: createHotelDto.capacity,
        },
      });
      return hotel;
    } catch (error) {
      throw new Error(`Could not create hotel: ${error.message}`);
    }
  }

  async findAll(takeNumber: string, takeSize: string): Promise<any> {
    try {
      const pageSize = parseInt(takeSize);
      const page = parseInt(takeNumber);
      const skip = page * pageSize;
      const totalCount = await this.prisma.hotel.count();
      const hotels = await this.prisma.hotel.findMany({
        skip: skip,
        take: pageSize,
        include: {
          groups: true,
        },
        where: {
          isDeleted: false,
        },
      });
      return { hotels: hotels, totalPages: totalCount, page: page };
    } catch (error) {
      throw new Error(`Could not find hotels: ${error.message}`);
    }
  }
  async findAvailableHotels(groupCapacity: number): Promise<Hotel[]> {
    // Get all the hotels from the database
    return await this.prisma.hotel.findMany({
      where: {
        // Filter out hotels that are marked as deleted
        isDeleted: false,
        // Check if the hotel has enough capacity for the group
        capacity: { gte: groupCapacity },
      },
      // Sort the hotels by their capacity in ascending order
      orderBy: {
        capacity: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Hotel> {
    try {
      const hotel = await this.prisma.hotel.findUnique({ where: { id } });
      if (!hotel) {
        throw new NotFoundException(`Could not find hotel with id ${id}`);
      }
      return hotel;
    } catch (error) {
      throw new Error(`Could not find hotel: ${error.message}`);
    }
  }

  async update(id: string, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    try {
      const hotel = await this.prisma.hotel.update({
        where: { id },
        data: updateHotelDto,
      });
      if (!hotel) {
        throw new NotFoundException(`Could not find hotel with id ${id}`);
      }
      return hotel;
    } catch (error) {
      throw new Error(`Could not update hotel: ${error.message}`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const hotel = await this.prisma.hotel.delete({ where: { id } });
      if (!hotel) {
        throw new NotFoundException(`Could not find hotel with id ${id}`);
      }
    } catch (error) {
      throw new Error(`Could not delete hotel: ${error.message}`);
    }
  }
}
