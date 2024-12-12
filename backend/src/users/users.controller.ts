import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { IUsersService } from './users.service';
import { LocalStrategy } from '../auth/stretegy/local.strategy';
import { JwtStrategy } from '../auth/stretegy/jwt.strategy';

@Controller('api')
export class UsersController {
    constructor(private readonly usersService: IUsersService) { }

    @UseGuards(JwtStrategy)
    @Post('admin/users')
    async create(@Body() data: Partial<User>): Promise<User> {
        return this.usersService.create(data);
    }

    @UseGuards(JwtStrategy)
    @Get('admin/users')
    async findAllAdmin(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @UseGuards(JwtStrategy)
    @Get('admin/users/:id')
    async findById(@Param('id') id: string): Promise<User | null> {
        return this.usersService.findById(id);
    }

    @UseGuards(JwtStrategy)
    @Get('admin/users/email/:email')
    async findByEmail(@Param('email') email: string): Promise<User | null> {
        return this.usersService.findByEmail(email)
    }

    @Get('manager/users')
    async findAllManager(): Promise<User[]> {
        return this.usersService.findAll();
    }


}
