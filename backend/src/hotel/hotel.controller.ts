import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { HotelService } from '../hotel/hotel.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHotelDto } from '../hotel/dto/create-hotel.dto';
import { Hotel } from '../hotel/schemas/hotel.schema';
import { UpdateHotelParams } from '../hotel/dto/update-hotel.dto'

@UseGuards(AuthGuard('admin'))
@Controller('admin')
export class HotelController {
    constructor(private readonly hotelService: HotelService) {}

    @Post('hotels')
    async createHotel(@Body() dto: CreateHotelDto): Promise<Hotel | null> {
      return this.hotelService.create(dto);
    }
  
    @Get('hotels')
    async findAllHotel(): Promise<Hotel[]> {
      return this.hotelService.findAll();
    }
  
    @Get('hotels/:id')
    async findByIdHotel(@Param('id') id: string): Promise<Hotel | null> {
      return this.hotelService.findById(id);
    }
  
    @Put('hotels/:id')
    async updateHotel(@Param('id') id: string, @Body() data: UpdateHotelParams): Promise<Hotel | null> {
        return this.hotelService.update(id, data)
    }


}
