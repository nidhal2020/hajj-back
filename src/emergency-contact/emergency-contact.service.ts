import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './dto';
import { EmergencyContact } from '@prisma/client';

@Injectable()
export class EmergencyContactService {
  constructor(private prisma: PrismaService) {}
  async createEmergencyContact(
    createEmergencyContactDto: CreateEmergencyContactDto,
    pilgrimId: string,
  ): Promise<EmergencyContact> {
    const existingPilgrim = await this.prisma.pilgrim.findUnique({
        where:{
            id:pilgrimId
        }
    })

    if(!existingPilgrim){
        throw new NotFoundException(
            `Pilgrim with ID '${pilgrimId}' not found`,
          );
    }
    const emergencyContact = await this.prisma.emergencyContact.create({
      data: {
        firstName: createEmergencyContactDto.firstName,
        lastName: createEmergencyContactDto.lastName,
        phone: createEmergencyContactDto.phone,
        email: createEmergencyContactDto.email,
        pilgrims: { connect: { id: pilgrimId } },
      },
    });
    return emergencyContact;
  }
  async getEmergencyContactById(id: string): Promise<EmergencyContact | null> {
    const emergencyContact = await this.prisma.emergencyContact.findUnique({
      where: { id },
    });
    return emergencyContact;
  }
  async updateEmergencyContact(
    id: string,
    updateEmergencyContactDto: UpdateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    const existingEmergencyContact =
      await this.prisma.emergencyContact.findUnique({
        where: { id },
      });
    if (!existingEmergencyContact) {
      throw new NotFoundException(
        `Emergency contact with ID '${id}' not found`,
      );
    }
    const updatedEmergencyContact = await this.prisma.emergencyContact.update({
      where: { id },
      data: updateEmergencyContactDto,
    });
    return updatedEmergencyContact;
  }
  async deleteEmergencyContact(id: string): Promise<void> {
    const existingEmergencyContact =
      await this.prisma.emergencyContact.findUnique({
        where: { id },
      });
    if (!existingEmergencyContact) {
      throw new NotFoundException(
        `Emergency contact with ID '${id}' not found`,
      );
    }
    await this.prisma.emergencyContact.delete({ where: { id } });
  }
}
