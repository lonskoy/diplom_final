import { Module } from '@nestjs/common';
import { ReservationClientController } from './reservation.client.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema, Reservation } from './schemas/reservation.shema';
import { HotelRoomModule } from '../hotel-room/hotel-room.module';
import { JwtModule } from '@nestjs/jwt';
import { ReservationManagerController } from './reservation.manager.controller';
import { EnvironmentService } from './../core/enviroment/enviroment.service';
import { EnviromentModule } from '../core/enviroment/enviroment.module';

@Module(
  {
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]), 
    HotelRoomModule,
    JwtModule.registerAsync({
          imports: [EnviromentModule],
          inject: [EnvironmentService],
          useFactory: (environmentService: EnvironmentService) => ({
            secret: environmentService.secret,
            signOptions: { expiresIn: '1h' },
          })
        })
  ],
  controllers: [ReservationClientController, ReservationManagerController],
  providers: [ReservationService]
})
export class ReservationModule {}
