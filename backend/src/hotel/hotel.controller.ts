import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { HotelService } from '../hotel/hotel.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHotelDto } from '../hotel/dto/create-hotel.dto';
import { UpdateHotelParams } from '../hotel/dto/update-hotel.dto'
import { SearchHotelParams } from './interfaces/SearchHotel.interface';

@UseGuards(AuthGuard('admin'))
@Controller('admin')
export class HotelController {
    constructor(private readonly hotelService: HotelService) {}

    @Post('hotels')
    async createHotel(@Body() dto: CreateHotelDto) {
      return this.hotelService.create(dto);
    }
  
    @Get('hotels')
    async findAllHotel(@Query() query: SearchHotelParams) {
      return this.hotelService.findAll(query);
    }
  
    @Get('hotels/:id')
    async findByIdHotel(@Param('id') id: string) {
      return this.hotelService.findById(id);
    }
  
    @Put('hotels-edit/:id')
    async updateHotel(@Param('id') id: string, @Body() data: UpdateHotelParams) {
        return this.hotelService.update(id, data)
    }


}
