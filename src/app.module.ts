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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'auth/registre', method: RequestMethod.POST },
        { path: 'users/allUsers', method: RequestMethod.GET },
        { path: 'pilgrim/allPilgrims', method: RequestMethod.GET },
      );
  }
}
