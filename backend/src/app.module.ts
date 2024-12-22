import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HotelModule } from './hotel/hotel.module';
import { HotelRoomModule } from './hotel-room/hotel-room.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://lonskoy0304:QeV6cIoPj2x5Y3K6@cluster0.lb8c1lp.mongodb.net/diplom?retryWrites=true&w=majority'), // как перенести в env??
    UsersModule,
    AuthModule,
    HotelModule,
    HotelRoomModule,
    ConfigModule.forRoot({
      isGlobal: true, // Делает конфигурацию env доступной во всем приложении
      envFilePath: '../.env'
    }),
    ReservationModule,
    
  ],
})

export class AppModule implements OnModuleInit {
  async onModuleInit() {
    try {
      await mongoose.connect('mongodb+srv://lonskoy0304:QeV6cIoPj2x5Y3K6@cluster0.lb8c1lp.mongodb.net/diplom?retryWrites=true&w=majority'); // как сделать сообщение о подключении в MomgooseModule?
      console.log('Подключение к БД успешно')
    } catch (error) {
      console.log('Ошибка подключения к БД')
    }
  }
}