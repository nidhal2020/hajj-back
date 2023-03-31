import { Controller, Get } from '@nestjs/common';
import { VaccinResDto } from './dto';
import { VaccinsService } from './vaccins.service';

@Controller('vaccins')
export class VaccinsController {
    constructor(private vaccin :VaccinsService) {
        
    }

    @Get('all')
    async getAllVaccins(): Promise<VaccinResDto[]>{
        return await this.vaccin.getAllVaccins();
    }
}
