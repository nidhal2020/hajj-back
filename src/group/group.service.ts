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
    const whereId: Prisma.UserWhereUniqueInput = {
      id: userData.user.id,
    };

    try {
      const user = await this.prisma.user.findUnique({ where: whereId });

      if (!user) {
        throw new NotFoundException(`User with id ${userData.id} not found`);
      }

      if (!createDto.userId) {
        createDto.userId = user.id;
      }
      if (user.id != createDto.userId) {
        throw new NotAcceptableException(
          `User with id ${createDto.userId} not the same user connected`,
        );
      }
      const existingGroup = await this.prisma.group.findFirst({
        where: {
          name: createDto.name,
          userId: createDto.userId as string,
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
              id: createDto.userId as string,
            },
          },
          chef: {
            connect: {
              id: createDto.chefId,
            },
          },
          hotel:{
            connect:{
              id:createDto.hotelId
            }
          }
        },
      });
      return group;
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  async getGroupsByCountry(
    userData: any,
    takeNumber: string,
    takeSize: string,
  ): Promise<GetGroupsDto> {
    try {
      const pageSize = parseInt(takeSize);
      const page = parseInt(takeNumber);
      const skip = page * pageSize;
      const totalCount = await this.prisma.group.count({
        where: { userId: userData.user.id },
      });

      console.log({
        pageSize,
        page,
        skip,
        totalCount,
      });

      const totalPages = Math.ceil(totalCount / pageSize);
      const user = await this.prisma.user.findUnique({
        where: { id: userData.user.id },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userData.id} not found`);
      }

      const groups = await this.prisma.group.findMany({
        skip: skip,
        take: pageSize,
        where: {
          userId: userData.user.id,
          isDeleted:false
        },
        include: {
          user: true,
          pilgrims: true,
          chef: true,
        },
      });
      const groupList = await this.groupInfo(groups);
 
        console.log(groupList);
   

      return {
        groups: groupList,
        totalPages: totalPages,
        page: page,
      };
    } catch (error) {
      return error;
    }
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
        },where:{
          isDeleted:false
        }
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

  async updateGroup(groupId:string, data:UpdateGroupReqDto ) {

    const {chefId, ...groupdata} = data
    const group  = await this.prisma.group.update({
      where:{
        id:groupId
      }
    ,data:{
        ...groupdata,
        chef: chefId ? {connect : {id:chefId}}:undefined
    },include:{
      chef:true
    }})
  }

  async deleteGroup(groupId:string) {
   
    await this.prisma.group.update({
      where:{
        id:groupId,
        
      },
      data:{
        isDeleted:true
      }
    })
    return {
      msg: "Group deleted succeful!"
    }
  }


  async groupInfo(group) {
    return Promise.all(
      group.map(async (g) => ({
        name: g.name,
        capacity: g.capacity,
        leaderName: await this.prisma.pilgrim.findUnique({
          where: { id: g.chef.pilgrimid },
          select: { lastName: true, name: true },
        }),
        country: g.user.name,
      })),
    );
  }
}
