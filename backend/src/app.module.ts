import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://lonskoy0304:QeV6cIoPj2x5Y3K6@cluster0.lb8c1lp.mongodb.net/diplom?retryWrites=true&w=majority'), // как перенести в env??
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true, // Делает конфигурацию env доступной во всем приложении
      envFilePath: '../.env'
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})

export class AppModule  {}