
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator"

export class CreateGroupDto {
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNumber()
    @IsNotEmpty()
    capacity:number

    @IsString()
    @MaxLength(200)
    description?:string


    @IsString()
    hotelId:string
}
