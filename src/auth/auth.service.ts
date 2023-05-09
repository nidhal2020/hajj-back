import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReqDto, LoginReqDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginReqDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    //if user dose not exist throw exceptio
    if (!user) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    if (user.status == false) {
      throw new ForbiddenException('Contact KSA to activate your account');
    }
    //compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    //if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    //send back the token
    return this.signToken(user.id, user.email);
  }

  async registreCountry(dto: CreateReqDto) {
    //genearete the password hash
    const hash = await argon.hash(dto.password);
    //save the new user
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          name: dto.name
        },
      });

      if (findUser && findUser.isDeleted == true) {
        const user = await this.prisma.user.update({
          where: {
            name: dto.name,
          },
          data: {
            email: dto.email,
            isDeleted: false,
            NumberOfPiligrimsAllowed: dto.NumberOfPiligrimsAllowed,
            hash
          },
        });
        return user;
      } else {
        const user = await this.prisma.user.create({
          data: {
            name: dto.name,
            email: dto.email,
            hash,
            NumberOfPiligrimsAllowed: dto.NumberOfPiligrimsAllowed,
          },
        });

        delete user.hash;
        return user;
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async loginAgent(dto: any) {
    //find the user by email
    const agent = await this.prisma.agent.findUnique({
      where: { matricule: dto.matricule },
    });
    //if user dose not exist throw exceptio
    if (!agent) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    if (agent.status == false) {
      throw new ForbiddenException('Contact KSA to activate your account');
    }
    if(agent.isDeleted == true){
      throw new ForbiddenException('Your account is deleted');
    }
    //compare password
    const pwMatches = await argon.verify(agent.password, dto.password);
    //if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect!');
    }
    //send back the token
    return this.signToken(agent.id, agent.email);
  }


  async signToken(
    UserId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: UserId, email: email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '150000m',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
  async defaultCreate(dto: CreateReqDto) {
    const admin = await this.prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!admin) {
      const hash = await argon.hash(dto.password);
      const createAdmin = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          name: dto.name,
          NumberOfPiligrimsAllowed: dto.NumberOfPiligrimsAllowed,
          role: 'ADMIN',
        },
      });
    } else {
      console.log(admin);
    }
  }
  // async defaultGroup(){
  //     const admin = await this.prisma.user.findFirst({
  //         where:{
  //             role:'ADMIN'
  //         }
  //     })

  //     const group = await this.prisma.group.create({
  //         data:{
  //             name:'waiting group',
  //             capacity:9999999,
  //             chefId:admin.id,
  //             userId:admin.id,
  //             hotelid:admin.id

  //         }
  //     })
  // }
}
