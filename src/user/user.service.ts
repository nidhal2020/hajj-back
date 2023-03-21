import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService){
    }

    async agetAllUsers():Promise<UserResDto[]>{
    
        return this.prisma.user.findMany({})
    }
}
