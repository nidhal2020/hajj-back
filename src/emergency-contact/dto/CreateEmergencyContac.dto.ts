import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEmergencyContactDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsOptional()
    email?: string;
  }