import { IsEmail,IsNotEmpty, IsString } from "class-validator"

export class LoginReqDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string
}