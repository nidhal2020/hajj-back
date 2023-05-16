import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnGatewayConnection, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(7000, { cors: true })
export class SocketGateway implements  OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
        console.log('Client connected', socket.id);
       
    });
  }

//   handleConnection(client: Socket) {
//     console.log('Client connected', client.id);
//     setInterval(() => {
//       client.emit('update', 'Hello from server');
//     }, 10000);
//   }

  //   @SubscribeMessage('claim')
  //   handleChat(client: Socket, message: string) {
  //     console.log('Received message:', message);
  //     this.server.emit('chat', message);
  //   }
}
