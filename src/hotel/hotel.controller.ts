import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/createHotel.dto';
import { Hotel } from '@prisma/client';
import { UpdateHotelDto } from './dto/updateHotel.dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {
  }
  @Get('getAvaiableHotels')
  async getAvaiableHotels(@Body() capacity:number):Promise<Hotel[]>{
    return await this.hotelService.findAvailableHotels(capacity)
  }
  @Post('createHotel')
  async createHotel(@Body() dto:CreateHotelDto):Promise<Hotel>{
    return await this.hotelService.create(dto)
    
  }
  @Get('getAllHotels')
  async getAllHotels(@Query() query: any):Promise<Hotel[]>{
    const { page , pageSize}  = query
    return await this.hotelService.findAll(page,pageSize)
  }

  @Get('getHotel/:id')
  async getHotelById(@Param('id') id:string):Promise<Hotel>{
    return await this.hotelService.findOne(id)
  }
  @Put('updateHotel/:id')
  async updateHotel(@Param('id') id:string,@Body() dto:UpdateHotelDto):Promise<Hotel>{
    return await this.hotelService.update(id,dto)
  }
  @Delete('remove/:id')
  async deleteHotel(@Param('id') id:string){
    try {
      await this.hotelService.remove(id)
      return {msg:'delete done!!'}
    } catch (error) {
      throw new Error(`Could not delete hotel: ${error.message}`);
    }
  }

}
