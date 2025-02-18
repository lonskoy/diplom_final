import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ManagerController } from './manager.controller';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtModule } from '@nestjs/jwt';
import { ManagerService } from './manager.service';
import { HotelRoom, HotelRoomSchema } from '../hotel-room/schemas/hotel-room.schema';
import { Reservation, ReservationSchema } from '../reservation/schemas/reservation.shema';
import { SupportRequestClientService } from '../chat/supportRequestClient.service';
import { SupportRequestService } from '../chat/supportRequest.service';
import { SupportRequest, SupportRequestSchema } from '../chat/schemas/support-request.schema';
import { EnviromentModule } from '../core/enviroment/enviroment.module';
import { EnvironmentService } from '../core/enviroment/enviroment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: HotelRoom.name, schema: HotelRoomSchema }]),
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema}]),
    MongooseModule.forFeature([{name: SupportRequest.name, schema: SupportRequestSchema}]),
    JwtModule.registerAsync({
              imports: [EnviromentModule],
              inject: [EnvironmentService],
              useFactory: (environmentService: EnvironmentService) => ({
                secret: environmentService.secret,
                signOptions: { expiresIn: '1h' },
              })
            })
  ],
  providers: [UsersService, ClientService, ManagerService, SupportRequestClientService, SupportRequestService],
  controllers: [UsersController, ManagerController, ClientController],
  exports: [UsersService],
})
export class UsersModule {}