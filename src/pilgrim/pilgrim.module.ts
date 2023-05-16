import { Module } from '@nestjs/common';
import { PilgrimService } from './pilgrim.service';
import { PilgrimController } from './pilgrim.controller';
import { SocketGateway } from 'src/socketIO/socket.gateway';

@Module({
  providers: [PilgrimService,SocketGateway],
  controllers: [PilgrimController]
})
export class PilgrimModule {}
