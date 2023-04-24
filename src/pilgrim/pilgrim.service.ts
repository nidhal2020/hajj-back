import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { PilgrimResponseDto, PilgromReqDto } from './dto';

@Injectable()
export class PilgrimService {
  constructor(private prisma: PrismaService) {}

  async addPilgrim(dto: PilgromReqDto,user:any): Promise<any> {
    try {
      const group: Group = await this.prisma.group.findUnique({
        where: {
          id: dto.groupId,
        },
      });
      if (!group) {
        throw new Error(`Group with id ${dto.groupId} not found`);
      }

      const pilgrim = await this.prisma.pilgrim.create({
        data: {
          numPassport: dto.numPassport,
          lastName: dto.lastName,
          name: dto.name,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          tel: dto.tel,
          group: {
            connect: {
              id: dto.groupId,
            },
          },
        },
      });
      const promises = dto.diseaseIds.map(async (diseaseId) => {
        const disease = await this.prisma.disease.findFirst({
          where: {
            id: diseaseId,
          },
        });
        if (!disease) {
          throw new NotFoundException(`Disease with ID ${diseaseId} not found.`);
        }
        const pilgrimHasDisease = await this.prisma.pilgrim_Has_Diseases.create({
          data: {
            assignedBy: 'system',
            pilgrim: {
              connect: {
                id: pilgrim.id,
              },
            },
            disease: {
              connect: {
                id: diseaseId,
              },
            },
          },
        });
      });
      const promises_vaccin = dto.vaccinIds.map(async (vaccinId) => {
        const vaccin = await this.prisma.vaccin.findFirst({
          where: {
            id: vaccinId,
          },
        });
  
        if (!vaccin) {
          throw new NotFoundException(`Vaccin with ID ${vaccinId} not found.`);
        }
  
        const pilgrimHasVaccin = await this.prisma.pilgrim_Has_Vaccins.create({
          data: {
            assignedBy: 'system',
            pilgrim: {
              connect: {
                id: pilgrim.id,
              },
            },
            vaccin: {
              connect: {
                id: vaccinId,
              },
            },
          },
        });
      });
      const pilgrimHasDiseases = await Promise.all(promises);
      const pilgrimHasVaccins = await Promise.all(promises_vaccin);
      const userData= await this.prisma.user.findUnique({
        where:{
          id:user.user.id
        }
      })

      await this.prisma.user.update({
        where:{
          id:userData.id
        },data:{
          currentNumberOfArrivingPilgrims:userData.currentNumberOfArrivingPilgrims+1
        }
      })

      return pilgrim;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async getAllPilgrims(
    pageNumber: string,
    takeNumber: string,
  ): Promise<PilgrimResponseDto> {
    const pageSize = parseInt(takeNumber);
    const page = parseInt(pageNumber);
    const skip = page * pageSize;
    const totalCount = await this.prisma.pilgrim.count();
    const totalPages = Math.ceil(totalCount / pageSize);
    const pilgrims = await this.prisma.pilgrim.findMany({
      skip: skip,
      take: pageSize,
      include: {
        group: {
          include: {
            user: true,
          },
        },
      },
    });
    const pilgrim = pilgrims.map((pilgrim) => ({
      numPassport: pilgrim.numPassport,
      name: pilgrim.name,
      lastName: pilgrim.lastName,
      gender: pilgrim.gender,
      dateOfBirth: pilgrim.dateOfBirth,
      tel: pilgrim.tel,
      groupID: pilgrim.group.id,
      groupName: pilgrim.group.name,
      countryName: pilgrim.group.user.name,
      countryId: pilgrim.group.user.id,
    }));
    return {
      pilgrimss: pilgrim,
      totalPages: totalPages,
    };
  }
  async getPilgrimByCountry(
    userId: string,
    pageNumber: string,
    takeNumber: string,
  ): Promise<PilgrimResponseDto> {
    const pageSize = parseInt(takeNumber);
    const page = parseInt(pageNumber);
    const skip = page * pageSize;
    const totalCount = await this.prisma.pilgrim.count({
      where: {
        group: {
          user: {
            id: userId,
          },
        },
      },
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    const pilgrims = await this.prisma.pilgrim.findMany({
      skip: skip,
      take: pageSize,
      include: {
        group: {
          include: {
            user: true,
          },
        },
      },
      where: {
        group: {
          user: {
            id: userId,
          },
        },
      },
    });
    const pilgrim = pilgrims.map((pilgrim) => ({
      numPassport: pilgrim.numPassport,
      name: pilgrim.name,
      lastName: pilgrim.lastName,
      gender: pilgrim.gender,
      dateOfBirth: pilgrim.dateOfBirth,
      tel: pilgrim.tel,
      groupID: pilgrim.group.id,
      groupName: pilgrim.group.name,
      countryName: pilgrim.group.user.name,
      countryId: pilgrim.group.user.id,
    }));
    return {
      pilgrimss: pilgrim,
      totalPages: totalPages,
    };
  }
}
