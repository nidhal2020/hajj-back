import { Module } from '@nestjs/common';
import { ChefService } from './chef.service';
import { ChefController } from './chef.controller';

@Module({
  providers: [ChefService],
  controllers: [ChefController]
})
export class ChefModule {}
