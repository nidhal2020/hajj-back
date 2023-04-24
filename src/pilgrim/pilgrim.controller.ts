import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PilgromReqDto } from './dto';
import { PilgrimService } from './pilgrim.service';

@UseGuards(JwtGuard)
@Controller('pilgrim')
export class PilgrimController {
  constructor(private pilgrim: PilgrimService) {}

  @Post('add')
  async addPilgrim(@Body() pilgrim: PilgromReqDto,@GetUser() user:User) {
    const pilgrimData = await this.pilgrim.addPilgrim(pilgrim,user);

    return  pilgrimData
  }
  @Get('allPilgrims')
  getAllPiligrims(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const skip = page;
    const take = pageSize; 
    return this.pilgrim.getAllPilgrims(skip, take);
  }

  @Get('allPilgrimsByCountry')
  getAllPilgrimsByCountry(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @GetUser() user: User,
  ) {
    const userId = user.id
    const skip = page;
    const take = pageSize;
    return this.pilgrim.getPilgrimByCountry(userId,skip,take)
    
  }
}
