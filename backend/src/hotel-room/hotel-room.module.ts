import { Module } from '@nestjs/common';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [
      HotelModule,
      MongooseModule.forFeature([{ name: HotelRoom.name, schema: HotelRoomSchema }]), 
    ],
  providers: [HotelRoomService],
  controllers: [HotelRoomController]
})
export class HotelRoomModule {}
