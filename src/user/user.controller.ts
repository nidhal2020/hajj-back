import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { UserService } from "./user.service";


@UseGuards(JwtGuard)
@Controller('users')
export class UsersController{
    constructor(private user:UserService){}
    @Get('me')
    getMe(@GetUser() user:User){
        return user
    }

    @Get('allUsers')
    getAll(){
        this.user.agetAllUsers()
    }
}