import { Group, Prisma, User } from '.prisma/client';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateGroupDto, GetGroupsDto, UpdateGroupReqDto } from './dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async createGroup(createDto: CreateGroupDto, userData: any) {
    console.log(userData);

    const whereId: Prisma.UserWhereUniqueInput = {
      id: userData.id,
    };

    const user = await this.prisma.user.findUnique({ where: whereId });

    if (!user) {
      throw new NotFoundException(`User with id ${userData.id} not found`);
    }

    if (!userData.id) {
      userData.id = user.id;
    }
    if (user.id != userData.id) {
      throw new NotAcceptableException(
        `User with id ${userData.id} not the same user connected`,
      );
    }
    const existingGroup = await this.prisma.group.findFirst({
      where: {
        name: createDto.name,
        userId: userData.id as string,
      },
    });
    if (existingGroup) {
      throw new ConflictException(
        `Group with name '${createDto.name}' already exists for user`,
      );
    }

    const group = await this.prisma.group.create({
      data: {
        name: createDto.name,
        capacity: createDto.capacity,
        description: createDto.description,
        user: {
          connect: {
            id: userData.id as string,
          },
        },
        hotel: {
          connect: {
            id: createDto.hotelId,
          },
        },
      },
    });
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        id: createDto.hotelId,
      },
    });

    const newHotelCapacity = hotel.capacity - createDto.capacity;

    await this.prisma.hotel.update({
      where: {
        id: createDto.hotelId,
      },
      data: {
        capacity: newHotelCapacity,
      },
    });

    return { group: group };
  }

  async getGroupsByCountry(userData: any): Promise<any> {
    // const pageSize = parseInt(takeSize);
    // const page = parseInt(takeNumber);
    // const skip = page * pageSize;
    // const totalCount = await this.prisma.group.count({
    //   where: { userId: userData.user.id },
    // });

    // console.log({
    //   pageSize,
    //   page,
    //   skip,
    //   totalCount,
    // });

    // const totalPages = Math.ceil(totalCount / pageSize);
    const user = await this.prisma.user.findUnique({
      where: { id: userData.id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userData.id} not found`);
    }

    const groups = await this.prisma.group.findMany({
      where: {
        userId: userData.id,
        isDeleted: false,
      },
      include: {
        user: true,
        pilgrims: true,
        chef: true,
      },
    });
    const groupList = await this.groupInfo(groups);

    // console.log(groupList);

    return groupList;
  }
  async getAllGroups(takeNumber: string, takeSize: string): Promise<any> {
    try {
      const pageSize = parseInt(takeSize);
      const page = parseInt(takeNumber);
      const skip = page * pageSize;
      const totalCount = await this.prisma.group.count();
      const totalPages = Math.ceil(totalCount / pageSize);
      const groups = await this.prisma.group.findMany({
        skip: skip,
        take: pageSize,
        include: {
          user: true,
          chef: true,
          pilgrims: true,
        },
        where: {
          isDeleted: false,
        },
      });

      const group = await this.groupInfo(groups);
      return {
        groups: group,
        totalPages: totalPages,
        page: page,
      };
    } catch (error) {
      return error;
    }
  }

  async updateGroup(groupId: string, data: any) {
     await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        name: data.name,
        capacity: data.capacity,
        hotelid: data.hotelId,
      },
    });
    
  }

  async deleteGroup(groupId: string) {
    await this.prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        isDeleted: true,
      },
    });
    return {
      msg: 'Group deleted succeful!',
    };
  }

  async groupInfo(group) {
    return Promise.all(
      group.map(async (g) => {
        const chefId = g.pilgrims.filter((p: any) => p.isChef == true)[0]?.id;
        const leader = chefId
          ? await this.prisma.pilgrim.findUnique({
              where: {
                id: g.pilgrims.filter((p: any) => p.isChef === true)[0]?.id,
              },
              select: { lastName: true, name: true },
            })
          : null;
        return {
          id: g.id,
          name: g.name,
          capacity: g.capacity,
          leaderName: chefId ? leader.name + ' ' + leader.lastName : 'no chef',
          country: g.user.name,
        };
      }),
    );
  }
}
