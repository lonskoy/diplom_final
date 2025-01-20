import { EnvironmentService } from './../core/enviroment/enviroment.service';
import { Inject, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminStrategy } from './stretegy/admin.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { ManagerStrategy } from './stretegy/manager.strategy';
import { ClientStrategy } from './stretegy/client.strategy';
import { LocalStrategy } from './stretegy/local.strategy';
import { EnviromentModule } from '../core/enviroment/enviroment.module';


@Module({
  imports: [
    UsersModule, // Импортируем UsersModule, где доступен IUsersService
    PassportModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [EnviromentModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        secret: environmentService.secret,
        signOptions: { expiresIn: '1h' },
      })
    })
  ],
  providers: [AuthService, AdminStrategy, ManagerStrategy, ClientStrategy, LocalStrategy], // Указываем JwtService в провайдерах
  controllers: [AuthController],
})
export class AuthModule {}