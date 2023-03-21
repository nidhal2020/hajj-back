
import { IsDate, IsNotEmpty, IsString, Matches, MaxDate } from "class-validator"

export class PilgromReqDto{

    @IsNotEmpty()
    @IsString()
    numPassport:string
    
    @IsNotEmpty()
    @IsString()
    name:string

    @IsNotEmpty()
    @IsString()
    lastName:string

    @IsNotEmpty()
    @IsString()
    gender:string

    @IsNotEmpty()
    @IsString()
    @Matches(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/, {
        message: 'Invalid date format, expected MM/DD/YYYY',
      })
    dateOfBirth:string
    
    @IsNotEmpty()
    @IsString()
    tel:string

    @IsNotEmpty()
    @IsString()
    groupId:string
}