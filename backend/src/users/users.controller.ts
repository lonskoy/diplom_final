import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CretaeUserDto } from './dto/create-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  async create(@Body() dto: CretaeUserDto): Promise<User> { // используем dto для проверки передаваемых данных с бэкенда
    return this.usersService.create(dto);
  }

  @Get('users')
  async findAllAdmin(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Get('users/email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }
}