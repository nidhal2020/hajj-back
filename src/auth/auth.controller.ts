import { Controller, Post, Body } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

import { LoginReqDto,CreateReqDto } from './dto';


@Controller('auth')
export class AuthController {
  upSert:CreateReqDto={
    email:"SaudiArabia@SaudiArabia.com",
    name:'Saudi Arabia',
    NumberOfPiligrimsAllowed:1000,
    password:"SaudiArabia",
  }
  constructor(private service: AuthService) {
    this.service.defaultCreate(this.upSert)
    // this.service.defaultGroup()
  }

  @Post('login')
  async login(@Body() loginDto: LoginReqDto) {
    return this.service.login(loginDto);
  }

  @Post('registre')
  async CreateCountry(@Body() createCountry: CreateReqDto) {
    return this.service.registreCountry(createCountry);
  }
}
