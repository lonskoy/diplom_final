import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { ManagerService } from './manager.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('manager'))
@Controller('manager')
export class ManagerController {
  constructor(private readonly usersService: ManagerService) {}

  @Get('users')
  async findAllManager(): Promise<User[]> {
    return this.usersService.findAll();
  }
}