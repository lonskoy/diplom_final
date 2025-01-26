import { Controller, Get, Post, Body, Param, UseGuards, Query, Delete } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { query } from 'express';
import { SearchUserParams } from './interfaces/searchUserParams.interface';


@UseGuards(AuthGuard('admin'))
@Controller('admin')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('users')
  async createUser(@Body() dto: CreateUserDto): Promise<User> { // используем dto для проверки передаваемых данных с бэкенда
    console.log('Переданные данные при создании пользователя через admin:  ',dto);
    return this.usersService.create(dto);
  }

  @Get('users')
  async findAllUser(@Query() query: SearchUserParams): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Get('users/:id')
  async findByIdUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findById(id);
  }

  @Get('users/email/:email')
  async findByEmailUser(@Param('email') email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }

  @Delete('users/:id')
  async removeUser(@Param('id') id: string ) {
    return this.usersService.removeUser(id);
  }

}