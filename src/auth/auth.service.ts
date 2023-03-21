import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateReqDto, LoginReqDto } from "./dto";
import * as argon from'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt/dist";;
import { ConfigService } from "@nestjs/config/dist/config.service";


@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwt:JwtService, private config:ConfigService){}


    async login(dto:LoginReqDto){
        //find the user by email
        const user = await this.prisma.user.findUnique({where:{email:dto.email}})
        //if user dose not exist throw exceptio
        if (!user){
            throw new ForbiddenException("Credentials incorrect!")
        }
        if(user.status==false){
            throw new ForbiddenException("Contact KSA to activate your account")
        }
        //compare password
        const pwMatches = await argon.verify(user.hash,dto.password)
        //if password incorrect throw exception 
        if(!pwMatches){
            throw new ForbiddenException('Credentials incorrect!')
        }
        //send back the token
        return this.signToken(user.id,user.email)
    }

    async registreCountry(dto:CreateReqDto){
        //genearete the password hash
        const hash = await argon.hash(dto.password)
        //save the new user
       try {
         const user = await this.prisma.user.create({
             data:{
                 name:dto.name,
                 email:dto.email,
                 hash,
                 NumberOfPiligrimsAllowed:dto.NumberOfPiligrimsAllowed
 
             }
         })

         delete user.hash
         return user
        }catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken');
              }
              
            }
            throw error
          }
    }

    async signToken(UserId:string, email:string):Promise<{access_token:string}>{
        const payload = {sub:UserId,email:email}
        const secret = this.config.get("JWT_SECRET")
        const token =  await this.jwt.signAsync(payload,{
            expiresIn:"150000m",
            secret: secret
        })
        return {
            access_token : token
        }
    }
}