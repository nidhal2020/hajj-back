import { ForbiddenException, Injectable } from '@nestjs/common';
import { Group } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PilgromReqDto } from 'src/pilgrim/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListeOfChef } from './dto';

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

    async getListOfChef():Promise<ListeOfChef[]>{
        const chefs = await this.prisma.pilgrim.findMany({where:{
            isChef:true
        }})

        const chef = chefs.map((chef)=>({
            id:chef.id,
            name:chef.name,
            lastName:chef.lastName
        }))

        return chef
    }

    async getListOfChefByCountry(userdata:any){
        const userId = userdata.user.id
        
        const chefs = await this.prisma.pilgrim.findMany({
            where:{
                isChef:true,
                group:
            },
            include:{
                group:true
            }
        })
        
    }
}
