import { Controller, Post, Body, Res, Request, ForbiddenException, Get } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ClientService } from './client.service';
import { Response } from 'express';


@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

@Post('register')
async create(@Body() dto: RegisterDto, @Res() res: Response, @Request() req: any)   {
   const access_token = req.cookies.access_token;
   if(access_token) throw new ForbiddenException('Доступ запрещен для авторизованных пользователей');
   return await this.clientService.create(dto, res);
}

@Get('rooms')
async allRooms() {
    return await this.clientService.allRooms();
}

}