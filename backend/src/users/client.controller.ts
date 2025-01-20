import { Controller, Post, Body, Res, Request, ForbiddenException, Get, UseGuards, Param, Query } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ClientService } from './client.service';
import { Response } from 'express';
import { FindRoomsOnData } from '../users/dto/find-rooms.dto';
import { SupportRequestClientService } from '../chat/supportRequestClient.service';
import { CreateSupportRequestDto } from '../chat/dto/chat.dto';
import { AuthGuard } from '@nestjs/passport';
import * as ChatDtos from  '../chat/dto/chat.dto'
 

@Controller('client')
export class ClientController {
    constructor(
        private readonly clientService: ClientService,
        private readonly supportRequestClient :SupportRequestClientService,
    ) {}

@Post('register')
async create(@Body() dto: RegisterDto, @Res() res: Response, @Request() req: any)   {
   const access_token = req.cookies.access_token;
   if(access_token) throw new ForbiddenException('Доступ запрещен для авторизованных пользователей');
   return await this.clientService.create(dto, res);
}

@Get('rooms')
async getAllRooms() {
    return this.clientService.allRooms();
}

@Get('find-room') 
async findRoomOnData(@Query() data: FindRoomsOnData) {
    return await this.clientService.findRoomsOnData(data);
}

@Get('find-room/:id') //Добавил для визуализации резервирований клиента
async findRoomById(@Param('id') id: string) {
    return this.clientService.findRoomById(id);
}

@UseGuards(AuthGuard('client'))
@Post('support-requests')
async createSupportRequest (@Body() data: CreateSupportRequestDto, @Request() req: any) {
    const access_token = req.cookies.access_token;
    return await this.supportRequestClient.createSupportRequest(data, access_token)
}

@UseGuards(AuthGuard('client'))
@Get('support-requests')
async findSupportRequests ( @Request() req: any) {
    const access_token = req.cookies.access_token;
    return await this.supportRequestClient.findSupportRequestsClient(access_token)
}

@UseGuards(AuthGuard('client'))
@Get('support-requests-messages-read/:id')
async markMessagesAsRead (@Param('id') id: string) {
    return await this.supportRequestClient.markMessagesAsRead(id)
}

}