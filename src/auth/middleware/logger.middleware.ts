import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private prisma:PrismaService, private jwt:JwtService){}
   async use(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1];
    const decodedToken  = this.jwt.verify(token,{secret:'super-secret-jwt-token'})
    if (!decodedToken) {
        throw new UnauthorizedException("you are not logedin!")
    }
    const userRole = await (await this.prisma.user.findUnique({where:{id:decodedToken.sub}})).role

    if (userRole=='ADMIN'){
        return next();
    }
    return res.status(401).json({error:'Unauthorized'})
}

}
