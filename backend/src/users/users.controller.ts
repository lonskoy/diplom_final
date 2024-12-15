import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { IUsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: IUsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('admin/users')
  async create(@Body() data: Partial<User>): Promise<User> {
    return this.usersService.create(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/users')
  async findAllAdmin(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/users/:id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/users/email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  @Get('manager/users')
  async findAllManager(): Promise<User[]> {
    return this.usersService.findAll();
  }
}