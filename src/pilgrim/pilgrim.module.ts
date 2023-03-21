import { Module } from '@nestjs/common';
import { PilgrimService } from './pilgrim.service';
import { PilgrimController } from './pilgrim.controller';

@Module({
  providers: [PilgrimService],
  controllers: [PilgrimController]
})
export class PilgrimModule {}
