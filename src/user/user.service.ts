import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserResDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){
    }

    async agetAllUsers():Promise<any>{
        const users = await this.prisma.user.findMany({
            where:{
                isDeleted:false
            }
        })

            return users
    }

    async deleteUser(userId:any){
        
        try {
          return  await this.prisma.user.update({
                where:{
                    id:userId.id
                },data:{
                    isDeleted : true
                }
            })
        } catch (error) {
            console.log(error);
            
            return error
        }
     
    }
    async updateUser(userId:any,updateDto:UpdateUserDto){
        try{
        const user = await this.prisma.user.findUnique({
            where:{
                id:userId.id
            }
        })
        if (user){
            return await this.prisma.user.update({
                where:{
                    id:userId.id
                },data:{
                    email:updateDto.email,
                    status:updateDto.status,
                    NumberOfPiligrimsAllowed:updateDto.NumberOfPiligrimsAllowed
                }
            })
        }else{
            return{
                msg:"user not found"
            }
        }
        }catch(error){
            return error
        }
    }
}
