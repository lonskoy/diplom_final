import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller('api')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('admin/users')
    async createUser(@Body() data: Partial<User>): Promise<User> {
        return this.usersService.createUser(data);
    }

    @Get('admin/users')
    async findAllAdmin(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get('manager/users')
    async findAllManager(): Promise<User[]> {
        return this.usersService.findAll();
    }


}
