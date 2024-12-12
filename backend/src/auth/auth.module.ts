import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IUsersService } from '../users/users.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
