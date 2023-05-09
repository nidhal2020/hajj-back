import { Controller, Post, UseGuards, Body, Get, Query, Delete, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { query } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateGroupDto, UpdateGroupReqDto } from './dto';
import { GroupService } from './group.service';

@UseGuards(JwtGuard)
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post('creategroup')
  async createGroup(@Body() dto: CreateGroupDto, @GetUser() user: any) {

    try {
      return await this.groupService.createGroup(dto, user);
    } catch (error) {
      console.log(error);
      // throw new HttpException(error,HttpStatus.BAD_REQUEST)
      
    }
  }
  @Get('allGroups')
  async getAllGroupsByCountry(@Query() query: any,@GetUser() user: any){
  const { page , pageSize}  = query
    
    return await this.groupService.getAllGroups(page,pageSize)
  }

  @Get('groupsByCountry')
  async getGroupsByCountry(@GetUser() user:any) {
    try {
      return await this.groupService.getGroupsByCountry(user)
      
    } catch (error) {
      // throw new HttpException(error,HttpStatus.BAD_REQUEST)
      console.log(error);
    }
  }

  @Delete('deleteGroup/:id')
  async deleteGroup(@Param('id') id:string){
    return await this.groupService.deleteGroup(id)
  }
  @Put('updateGroup/:id')
  async updateGroup(@Param('id') id:string,@Body() dto:any){
    return await this.groupService.updateGroup(id,dto)
  }
}
