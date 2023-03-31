import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VaccinResDto } from './dto';

@Injectable()
export class VaccinsService {
  constructor(private prisma: PrismaService) {}

  async getAllVaccins(): Promise<VaccinResDto[]> {
    const vaccin =  await this.prisma.vaccin.findMany();
    const vaccins = vaccin.map((v)=>({
        id:v.id,
        name:v.vaccinName
    }))
    return vaccins
  }
}
