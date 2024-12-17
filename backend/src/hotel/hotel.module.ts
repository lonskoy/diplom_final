import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelController } from './hotel.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]), 
  ],
  providers: [HotelService], 
  controllers: [HotelController], 
  exports: [MongooseModule],
  
})
export class HotelModule {}