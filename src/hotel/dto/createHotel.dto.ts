import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumberString({no_symbols:true})
  phoneNumber: string;

  @IsOptional()
  @Min(1)
  @Max(5)
  stars?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  capacity:number
  
}
