import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto";


@UseGuards(JwtGuard)
@Controller('users')
export class UsersController{
    constructor(private user:UserService){}
    @Get('me')
    getMe(@GetUser() user:User){
    
        return user
    }

    @Get('allUsers')
    async getAll(){
        return await this.user.agetAllUsers()
    }
    @Delete('delete/:id')
    async deleteUser(@Param() id:string){
        return await this.user.deleteUser(id)
    }

    @Patch('update/:id')
    async updateUser(@Param() id:string,@Body() req:UpdateUserDto){
        return await this.user.updateUser(id,req)
    }
}