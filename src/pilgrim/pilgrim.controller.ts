import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PilgromReqDto } from './dto';
import { PilgrimService } from './pilgrim.service';
import { agent } from 'supertest';
import { SocketGateway } from 'src/socketIO/socket.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(JwtGuard)
@Controller('pilgrim')
export class PilgrimController {
  constructor(
    private pilgrim: PilgrimService,
    @Inject(SocketGateway) private socketGateway: SocketGateway,
    private prisma: PrismaService,
  ) {}

  @Post('add')
  async addPilgrim(@Body() pilgrim: any, @GetUser() user: User) {
    const pilgrimData = await this.pilgrim.addPilgrim(pilgrim, user);

    return pilgrimData;
  }
  @Get('allPilgrims')
  async getAllPiligrims(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('country') countryQuery: string,
  ) {
    const skip = page;
    const take = pageSize;
    const country = countryQuery;

    return await this.pilgrim.getAllPilgrims(skip, take, country);
  }
  @Delete('delete/:id')
  async deletePilgrim(@Param('id') id: string) {
    try {
      console.log('id', id);

      return await this.pilgrim.deletePilgrim(id);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('allPilgrimsByCountry')
  getAllPilgrimsByCountry(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @GetUser() user: User,
  ) {
    const userId = user.id;
    const skip = page;
    const take = pageSize;

    return this.pilgrim.getPilgrimByCountry(userId, skip, take);
  }

  @Put('updatestatus/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() status: any,
    @GetUser() agent: any,
  ): Promise<any> {
    try {
      console.log('id', id);
      console.log('status', status.status);
      console.log('agent', agent);

      const claim = await this.pilgrim.scannHistory(
        id,
        agent.id,
        status.status,
      );
      await this.pilgrim.updatePilgrimStatus(id, status.status);
      const socketData = {
        agentName: await this.prisma.agent.findUnique({
          where: {
            id: agent.id,
          },
          select: {
            firstName: true,
            lastName: true,
          },
        }),
        pilgrimName: await this.prisma.pilgrim.findUnique({
          where: {
            id: id,
          },
          select: {
            name: true,
            lastName: true,
          },
        }),
        status: claim.action,
        date: claim.createdAt,
      };
      this.socketGateway.server.emit('update', socketData);
      return {
        data: socketData,
        message: 'updated successfully',
        success: true,
      };
    } catch (error) {
      throw new Error(`Could not update pilgrim: ${error.message}`);
    }
  }
  @Get('statistics')
  async getStatistics() {
    return await this.pilgrim.getStatistiqueAdmin();
  }
  @Get('statisticsByCountry')
  async getStatisticsByCountry(@GetUser() user: any) {
    return await this.pilgrim.getStatistiqueCountry(user.id);
  }
  @Get('statisticage')
  async getStatisticAge(@GetUser() user: any) {
    return await this.pilgrim.getAgeRangeStatistics(user.id);
  }
}
