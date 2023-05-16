import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { PrismaService } from 'src/prisma/prisma.service';
import e from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor( config:ConfigService, private prisma:PrismaService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: config.get("JWT_SECRET")
        });
      }
    async validate(payload: {sub:string,email:string}) {
        
        const user = await this.prisma.user.findUnique({where:{id:payload.sub}})
        const agent = await this.prisma.agent.findUnique({where:{id:payload.sub}})
        if(user){
          delete user.hash
          return  user ;
        }else{
          delete agent.password
          return agent ;
        }
    }
    // async validateAgent(payload: {sub:string,matricule:string}) {
          
    //     const agent = await this.prisma.agent.findUnique({where:{id:payload.sub}})
    //     delete agent.password
    //     return  agent ;
    // }
}