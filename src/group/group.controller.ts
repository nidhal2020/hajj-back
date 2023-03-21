import { Controller, Post, UseGuards, Body, Get, Query, Delete, Param } from '@nestjs/common';
import { User } from '@prisma/client';
import { query } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateGroupDto } from './dto';
import { GroupService } from './group.service';

@UseGuards(JwtGuard)
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post('creategroup')
  async createGroup(@Body() dto: CreateGroupDto, @GetUser() user: User) {

    return await this.groupService.createGroup(dto, user);
  }
  @Get('allGroups')
  async getAllGroupsByCountry(@Query() query: any,@GetUser() user: User){
  const { page , pageSize}  = query
    
    return await this.groupService.getAllGroups(page,pageSize)
  }

  @Get('groupsByCountry')
  async getGroupsByCountry(@Query() query:any,@GetUser() user:User) {
    const { page , pageSize}  = query
    return await this.groupService.getGroupsByCountry(user,page,pageSize)
  }

  @Delete('deleteGroup/:id')
  async deleteGroup(@Param('id') id:string){
    return await this.groupService.deleteGroup(id)
  }
}
