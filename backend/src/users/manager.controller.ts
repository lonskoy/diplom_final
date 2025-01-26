import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { ManagerService } from './manager.service';
import { AuthGuard } from '@nestjs/passport';
import { SearchUserParams } from './interfaces/searchUserParams.interface';

@UseGuards(AuthGuard('manager'))
@Controller('manager')
export class ManagerController {
  constructor(private readonly usersService: ManagerService) {}

  @Get('users')
  async findAllManager(@Query() query: SearchUserParams): Promise<User[]> {
    return this.usersService.findAll();
  }
}