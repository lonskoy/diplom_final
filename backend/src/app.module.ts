import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { HotelRoomModule } from './hotel-room/hotel-room.module';
import { ReservationModule } from './reservation/reservation.module';
import { ChatModule } from './chat/chat.module';

import { ChatGateway } from './chatOnline/chat.gateway';
import { EnviromentModule } from './core/enviroment/enviroment.module';
import { EnvironmentService } from './core/enviroment/enviroment.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MongooseModule.forRootAsync({
      imports: [EnviromentModule], // Импортируем EnvironmentModule
      inject: [EnvironmentService], // Внедряем EnvironmentService
      useFactory: (environmentService: EnvironmentService) => ({
        uri: environmentService.url_mongo, // Берем URL MongoDB из EnvironmentService
      }),
    }),
    UsersModule,
    AuthModule,
    HotelModule,
    HotelRoomModule,
    ReservationModule,
    ChatModule,
    EnviromentModule, 
  ],
  providers: [ChatGateway],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly environmentService: EnvironmentService) {}

  async onModuleInit() {
    const mongoUrl = this.environmentService.url_mongo;
  
    if (!mongoUrl) {
      console.error('Ошибка: URL для подключения к MongoDB не найден в env!');
      process.exit(1); // Останавливаем приложение
    }
  
    try {
      await mongoose.connect(mongoUrl);
      console.log('Подключение к БД успешно');
    } catch (error) {
      console.error('Ошибка подключения к БД:', error);
    }
  }
}
  
