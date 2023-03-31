import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PilgrimHasVaccinsService {
  constructor(private prisma: PrismaService) {}

  async addVaccinToPilgrim(
    pilgrimId: string,
    vaccinIds: string[],
  ): Promise<any> {
    const pilgrim = await this.prisma.pilgrim.findFirst({
      where: {
        id: pilgrimId,
      },
    });
    if (!pilgrim) {
      throw new NotFoundException(`Pilgrim with ID ${pilgrimId} not found.`);
    }

    const promises = vaccinIds.map(async (vaccinId) => {
      const vaccin = await this.prisma.vaccin.findFirst({
        where: {
          id: vaccinId,
        },
      });

      if (!vaccin) {
        throw new NotFoundException(`Vaccin with ID ${vaccinId} not found.`);
      }

      const pilgrimHasVaccin = await this.prisma.pilgrim_Has_Vaccins.create({
        data: {
          assignedBy: 'system',
          pilgrim: {
            connect: {
              id: pilgrimId,
            },
          },
          vaccin: {
            connect: {
              id: vaccinId,
            },
          },
        },
      });
      return pilgrimHasVaccin;
    });

    const pilgrimHasVaccins = await Promise.all(promises);
    return pilgrimHasVaccins;
  }
}
