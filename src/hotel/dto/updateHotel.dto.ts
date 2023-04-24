import { IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateHotelDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    phoneNumber?: string;
  
    @IsOptional()
    @Min(1)
    @Max(5)
    stars?: number;

    @IsOptional()
    @Min(1)
    capacity:number
  }