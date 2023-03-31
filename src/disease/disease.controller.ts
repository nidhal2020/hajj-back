import { Controller, Get } from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { DiseaseResDto } from './dto';

@Controller('disease')
export class DiseaseController {
    constructor(private disease:DiseaseService ) {
    }

    
    @Get('all')
    async getAllDiseases():Promise<DiseaseResDto[]>{
        return await this.disease.getAllDiseases()
    }
}
