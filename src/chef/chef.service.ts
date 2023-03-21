import { ForbiddenException, Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PilgromReqDto } from 'src/pilgrim/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChefService {
    constructor(private prisma: PrismaService) {}
    async createChef(dto:PilgromReqDto):Promise<any>{
        try {
            const group:Group = await this.prisma.group.findUnique({
                where:{
                    id:dto.groupId
                }
            })
            if(!group){
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
              isChef:true,
              group: {
                connect:{
                    id:dto.groupId
                }
              }        },
          });
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
}
