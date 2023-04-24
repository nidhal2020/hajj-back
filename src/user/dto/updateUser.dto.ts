import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, Min } from "class-validator";

export class UpdateUserDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsBoolean()
    status:boolean

    @IsNumber()
    @Min(0)
    NumberOfPiligrimsAllowed:number
}