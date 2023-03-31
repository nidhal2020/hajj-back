import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiseaseResDto } from './dto';

@Injectable()
export class DiseaseService {
    constructor(private prisma: PrismaService) {
        
    }

    async getAllDiseases(): Promise<DiseaseResDto[]>{
        const res = await this.prisma.disease.findMany()
        const diseases = res.map((d) => ({ 
            id:d.id,
            name: d.diseaseName
        }))

        return diseases
    }
}
