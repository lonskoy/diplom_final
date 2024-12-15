import { Controller, Get } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('manager')
export class ManagerController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  async findAllManager(): Promise<User[]> {
    return this.usersService.findAll();
  }
}