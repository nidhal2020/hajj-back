import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { ChefService } from './chef.service';
import { JwtGuard } from 'src/auth/guard';
@UseGuards(JwtGuard)
@Controller('chef')
export class ChefController {
    constructor(private chefService:ChefService){}
    @Post('add')
    async  addChefGoup(@Body() pilgrim: any, @GetUser() user: any){
        console.log('controller',user);
        
        const pilgrimChef = await this.chefService.createChef(pilgrim,user)
        return pilgrimChef
    }

    @Get('allchefs')
    async getAllChefs(@GetUser() user: any):Promise<any>{
        const chefs = await this.chefService.getAllChef(user)
        return chefs

    }
}
