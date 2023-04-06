import { Controller, Param, Post, Body, UseGuards } from '@nestjs/common';
import { PilgrimHasVaccinsService } from './pilgrim_has_vaccins.service';
import { JwtGuard } from 'src/auth/guard';
@UseGuards(JwtGuard)
@Controller('pilgrim-has-vaccins')
export class PilgrimHasVaccinsController {
  constructor(private pilgrimHasVaccinsService: PilgrimHasVaccinsService) {}

  @Post(':pilgrimId/vaccins')
  async addVaccinsToPilgrim(@Param(':pilgrimId') pilgrimId: string,@Body() VaccinIds:string[]):Promise<any>{
    return await this.pilgrimHasVaccinsService.addVaccinToPilgrim(pilgrimId,VaccinIds)
  }
}
