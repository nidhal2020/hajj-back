import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PilgrimHasDiseasesService {
  constructor(private prisma: PrismaService) {}

  async addDiseasesToPilgrim(
    pilgrimId: string,
    diseaseIds: string[],
  ): Promise<any> {
    const pilgrim = await this.prisma.pilgrim.findFirst({
      where: {
        id: pilgrimId,
      },
    });
    if (!pilgrim) {
      throw new NotFoundException(`Pilgrim with ID ${pilgrimId} not found.`);
    }

    const promises = diseaseIds.map(async (diseaseId) => {
      const disease = await this.prisma.disease.findFirst({
        where: {
          id: diseaseId,
        },
      });
      if (!disease) {
        throw new NotFoundException(`Disease with ID ${diseaseId} not found.`);
      }
      const pilgrimHasDisease = await this.prisma.pilgrim_Has_Diseases.create({
        data: {
          assignedBy: 'system',
          pilgrim: {
            connect: {
              id: pilgrimId,
            },
          },
          disease: {
            connect: {
              id: diseaseId,
            },
          },
        },
      });
      return pilgrimHasDisease;
    });
    const pilgrimHasDiseases = await Promise.all(promises);

    return pilgrimHasDiseases;
  }
}
