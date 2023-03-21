import { IsEmail,IsNotEmpty, IsString, IsNumber } from "class-validator"


export class CreateReqDto{
    @IsString()
    @IsNotEmpty()
    name :string

    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @IsNotEmpty()
    password:string

    @IsNumber()
    NumberOfPiligrimsAllowed:number
}