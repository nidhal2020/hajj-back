import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateAgentDto {
  @IsNotEmpty()
  @IsString()
  matricule: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsString()
  departement: string;

  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password: string;
}
