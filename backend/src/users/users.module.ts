
import { Module } from '@nestjs/common';
import { IUsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { User } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [IUsersService],
  controllers: [UsersController],
  exports: [IUsersService],
})
export class UsersModule {}