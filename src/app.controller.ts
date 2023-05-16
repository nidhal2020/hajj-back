import { Controller, Get, Inject } from '@nestjs/common';
import { SocketGateway } from './socketIO/socket.gateway';

@Controller()
export class AppController {
  constructor(@Inject(SocketGateway) private socketGateway: SocketGateway) {}

  @Get('/testSocket')
  sendMessage() {
    this.socketGateway.server.emit('chat', 'Hello, clients!');
    return 'Message sent';
  }
}