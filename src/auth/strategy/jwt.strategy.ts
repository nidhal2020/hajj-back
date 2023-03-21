import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { PrismaService } from 'src/prisma/prisma.service';

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
        delete user.hash
        return { user };
    }
}