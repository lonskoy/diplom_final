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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({ // Регистрируем JwtModule
      secret: 'stranaferm40', // перенести в env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, ClientService, ManagerService],
  controllers: [UsersController, ManagerController, ClientController],
  exports: [UsersService],
})
export class UsersModule {}