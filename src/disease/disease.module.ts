import { Module } from '@nestjs/common';
import { DiseaseService } from './disease.service';
import { DiseaseController } from './disease.controller';

@Module({
  providers: [DiseaseService],
  controllers: [DiseaseController]
})
export class DiseaseModule {}
