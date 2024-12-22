import { Controller, Post, Body, Res } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ClientService } from './client.service';
import { Response } from 'express'


@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

@Post('register')
async create(@Body() dto: RegisterDto, @Res() res: Response)  {
   return await this.clientService.create(dto, res);
}

}