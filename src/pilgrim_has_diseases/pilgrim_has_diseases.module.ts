import { Module } from '@nestjs/common';
import { PilgrimHasDiseasesService } from './pilgrim_has_diseases.service';
import { PilgrimHasDiseasesController } from './pilgrim_has_diseases.controller';

@Module({
  controllers: [PilgrimHasDiseasesController],
  providers: [PilgrimHasDiseasesService]
})
export class PilgrimHasDiseasesModule {}
