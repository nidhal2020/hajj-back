import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PilgromReqDto } from 'src/pilgrim/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListeOfChef } from './dto';

@Injectable()
export class ChefService {
  constructor(private prisma: PrismaService) {}
  async createChef(dto: PilgromReqDto,user:any): Promise<any> {
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
          name: dto.firstName,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          tel: dto.tel,
          isChef:true,
          group: {
            connect: {
              id: dto.groupId,
            },
          },
        },
      });

      await this.prisma.chef.create({
        data: {
          pirlgrim:{
            connect:{
              id:pilgrim.id
            }
          },
          groups:{
            connect:{
              id:dto.groupId
            }
          }
        }
      })
      
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
      console.log('user',user);
      
      // const pilgrimHasDiseases = 
      await Promise.all(promises);
      // const pilgrimHasVaccins = 
      await Promise.all(promises_vaccin);
      const userData= await this.prisma.user.findUnique({
        where:{
          id:user.id
        }
      })
      await this.prisma.emergencyContact.create({
        data: {
          firstName: dto.firstNameEmergencyContact,
          lastName: dto.lastNameEmergencyContact,
          phone: dto.phoneEmergencyContact,
          email: dto.emailEmergencyContact,
          pilgrims: { connect: { id: pilgrim.id } },
        },
      });

      await this.prisma.user.update({
        where:{
          id:userData.id
        },data:{
          currentNumberOfArrivingPilgrims:userData.currentNumberOfArrivingPilgrims+1
        }
      })
      const qrCOdeData = await this.prisma.pilgrim.findUnique({
        where:{
          id:pilgrim.id
        },include:{
          diseases:true,
          vaccins:true,
          emergencyContact:true
        }
      })
      return qrCOdeData
      
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }


  async getAllChef(user:any): Promise<any> {
    const pilgrimchef = await this.prisma.pilgrim.findMany({
      where:{
        isChef:true,
        group:{
          userId:user.id
        }
      }
    });
    return pilgrimchef;
  }
}
