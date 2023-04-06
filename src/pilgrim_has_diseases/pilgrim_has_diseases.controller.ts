import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { Pilgrim } from '@prisma/client';
import { PilgrimHasDiseasesService } from './pilgrim_has_diseases.service';
import { JwtGuard } from 'src/auth/guard';
@UseGuards(JwtGuard)
@Controller('pilgrim-has-diseases')
export class PilgrimHasDiseasesController {
  constructor(private pilgrimHasDiseasesService: PilgrimHasDiseasesService) {}

  @Post(':pilgrimId/diseases')
  async addDiseasesToPilgrim(@Param('pilgrimId') pilgrimId: string,@Body() diseaseIds: string[]):Promise<Pilgrim>{
    return await this.pilgrimHasDiseasesService.addDiseasesToPilgrim(pilgrimId,diseaseIds)
  }
}
