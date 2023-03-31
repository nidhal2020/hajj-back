import { Module } from '@nestjs/common';
import { VaccinsService } from './vaccins.service';
import { VaccinsController } from './vaccins.controller';

@Module({
  providers: [VaccinsService],
  controllers: [VaccinsController]
})
export class VaccinsModule {}
