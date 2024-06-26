import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PilgrimModule } from './pilgrim/pilgrim.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './auth/middleware';
import { JwtModule } from '@nestjs/jwt';
import { GroupModule } from './group/group.module';
import { ChefModule } from './chef/chef.module';
import { VaccinsModule } from './vaccins/vaccins.module';
import { DiseaseModule } from './disease/disease.module';
import { PilgrimHasDiseasesModule } from './pilgrim_has_diseases/pilgrim_has_diseases.module';
import { PilgrimHasVaccinsModule } from './pilgrim_has_vaccins/pilgrim_has_vaccins.module';
import { EmergencyContactModule } from './emergency-contact/emergency-contact.module';
import { HotelModule } from './hotel/hotel.module';
import { AgentModule } from './agent/agent.module';
import { SocketGateway } from './socketIO/socket.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({}),
    UserModule,
    PilgrimModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GroupModule,
    ChefModule,
    VaccinsModule,
    DiseaseModule,
    PilgrimHasDiseasesModule,
    PilgrimHasVaccinsModule,
    EmergencyContactModule,
    HotelModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [SocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'auth/registre', method: RequestMethod.POST },
        { path: 'users/allUsers', method: RequestMethod.GET },
        { path: 'pilgrim/allPilgrims', method: RequestMethod.GET },
        { path: 'hotel/createHotel', method: RequestMethod.POST },
        { path: 'hotel/getHotel', method: RequestMethod.GET },
        { path: 'hotel/updateHotel', method: RequestMethod.PUT },
        { path: 'hotel/remove', method: RequestMethod.DELETE },
        { path: 'agent', method: RequestMethod.ALL },
      );
  }
}
