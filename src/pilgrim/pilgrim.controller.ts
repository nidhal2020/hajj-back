import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
  async addPilgrim(@Body() pilgrim: any, @GetUser() user: User) {
    const pilgrimData = await this.pilgrim.addPilgrim(pilgrim, user);

    return pilgrimData;
  }
  @Get('allPilgrims')
  async getAllPiligrims(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('country') countryQuery:string
  ) {
    const skip = page;
    const take = pageSize;
    const country = countryQuery

    return await this.pilgrim.getAllPilgrims(skip, take,country);
  }
  @Delete('delete/:id')
  async deletePilgrim(@Param('id') id:string){
    try {
      console.log('id',id);
      
      return await this.pilgrim.deletePilgrim(id)
      
    } catch (error) {
      console.log(error);
      
    }
  }

  @Get('allPilgrimsByCountry')
  getAllPilgrimsByCountry(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @GetUser() user: User,
  ) {
    const userId = user.id;
    const skip = page;
    const take = pageSize;
  
    return this.pilgrim.getPilgrimByCountry(userId, skip, take);
  }

  @Put('updatestatus/:id')
  async updateStatus(@Param('id') id:string,@Body() status:any):Promise<any>{
    return await this.pilgrim.updatePilgrimStatus(id,status)
  }
}
