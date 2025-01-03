import { Module } from '@nestjs/common';
import { ReservationClientController } from './reservation.client.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema, Reservation } from './schemas/reservation.shema';
import { HotelRoomModule } from '../hotel-room/hotel-room.module';
import { JwtModule } from '@nestjs/jwt';
import { ReservationManagerController } from './reservation.manager.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]), 
    HotelRoomModule,
    JwtModule.register({ // Регистрируем JwtModule
      secret: 'stranaferm40', // Здесь вы можете передавать переменную из .env, если настроите ConfigModule
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ReservationClientController, ReservationManagerController],
  providers: [ReservationService]
})
export class ReservationModule {}
