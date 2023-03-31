import { Module } from '@nestjs/common';
import { PilgrimHasVaccinsService } from './pilgrim_has_vaccins.service';
import { PilgrimHasVaccinsController } from './pilgrim_has_vaccins.controller';

@Module({
  controllers: [PilgrimHasVaccinsController],
  providers: [PilgrimHasVaccinsService]
})
export class PilgrimHasVaccinsModule {}
