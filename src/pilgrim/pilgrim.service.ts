import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { PilgrimResponseDto, PilgromReqDto, PiligrilQrCode } from './dto';
import { async } from 'rxjs';

@Injectable()
export class PilgrimService {
  constructor(private prisma: PrismaService) {
  // this.test().then(res=>{
  //   console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',res);
    
  // })
  }


  // async test():Promise<any>{
  //   const pilgrim = await this.prisma.pilgrim.findMany({
  //     select:{
  //       status:true
  //     }
  //   })
  //   return pilgrim
  // }

  async addPilgrim(dto: PilgromReqDto,user:any): Promise<PiligrilQrCode> {
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
      console.log('qrCOdeData',qrCOdeData.vaccins);
      
      const  emergencyContact = await this.prisma.emergencyContact.findUnique({
        where:{
          id:qrCOdeData.emergencyContact.id
        },select:{
          firstName:true,
          lastName:true,
          phone:true,
        }

      })
      const diseasesName = qrCOdeData.diseases.map(async (disease:any)=>{
          return await this.prisma.disease.findUnique({
            where:{
              id:disease.diseaseId
            },select:{
              diseaseName:true
            }

          })
      })
      const vaccinsName = qrCOdeData.vaccins.map(async (vaccin:any)=>{
         return await this.prisma.vaccin.findUnique({
          where:{
            id:vaccin.vaccinId
          },select:{
            vaccinName:true
          }
        })
      })
      const diseasePormis =  await Promise.all(diseasesName)
      const vaccinPromis= await Promise.all(vaccinsName)
      const qrCode = {
        id:qrCOdeData.id,
        numPassport:qrCOdeData.numPassport,
        name:qrCOdeData.name,
        lastName:qrCOdeData.lastName,
        dateOfBirth:qrCOdeData.dateOfBirth,
        status:qrCOdeData.status,
        nameEmercency:emergencyContact.firstName,
        lastNameEmercency:emergencyContact.lastName,
        phoneEmercency:emergencyContact.phone,
        diseases: diseasePormis,
        vaccins: vaccinPromis,
      }
      console.log(qrCode);
      
      return qrCode
      
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
    

  }

  async deletePilgrim(pilgrimId:string):Promise<any>{
    console.log('pilgrimmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');
  
    try {
      
      const pilgrim = await this.prisma.pilgrim.update({ where: { id:pilgrimId },data:{isDeleted:true} });
      if (!pilgrim) {
        throw new NotFoundException(`Could not find pilgrim with id ${pilgrimId}`);
      }
    } catch (error) {
      throw new Error(`Could not delete pilgrim: ${error.message}`);
    }
  }

  async getAllPilgrims(
    pageNumber: string,
    takeNumber: string,
    country:string
  ): Promise<PilgrimResponseDto> {
    const pageSize = parseInt(takeNumber);
    const page = parseInt(pageNumber) - 1;
    const skip = page * pageSize;
    const totalCount = await this.prisma.pilgrim.count({where:{
      group:{
        user:{
          name:country
        }
      }
    }});
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
      where:{
        group:{
          user:{
            name:country
          }
        },isDeleted:false
      }
    });
    const pilgrim = pilgrims.map((pilgrim) => ({
      id:pilgrim.id,
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
      status : pilgrim.status
    }));
    return {
      pilgrimss: pilgrim,
      totalPages: totalPages,
      totale: totalCount
    };
  }
  async getPilgrimByCountry(
    userId: string,
    pageNumber: string,
    takeNumber: string,
  ): Promise<PilgrimResponseDto> {
    const pageSize = parseInt(takeNumber);
    const page = parseInt(pageNumber) - 1;
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
        },isDeleted:false
      },
    });
    const pilgrim = pilgrims.map((pilgrim) => ({
      id:pilgrim.id,
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
      status:pilgrim.status
    }));
    console.log(pilgrim[0]);
    
    return {
      pilgrimss: pilgrim,
      totalPages: totalPages,
      totale: totalCount
      
    };
  }

  async updatePilgrimStatus(pilgrimId:string,status:any):Promise<any>{
    try {
      const pilgrim = await this.prisma.pilgrim.update({where:{id:pilgrimId},data:{status:status}})
      if (!pilgrim) {
        throw new NotFoundException(`Could not find pilgrim with id ${pilgrimId}`);
      }
      return pilgrim
    } catch (error) {
      throw new Error(`Could not update pilgrim: ${error.message}`);
    }
  }
}
