import { Body, Controller, Post, Delete, UseGuards, Request, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservationDto } from './dto/create-booking.dto';
import { ReservationService } from './reservation.service';

@UseGuards(AuthGuard('client'))
@Controller('client')
export class ReservationClientController {
    constructor(private readonly reservationService: ReservationService) {}
    
    @Post('reservations')
    async createReservation(@Body() data: ReservationDto, @Request() req:any ) {
        const access_token = req.cookies['access_token'];
        return  this.reservationService.create(data, access_token);
    }

    @Get('reservations')
    async allReservationClient(@Request() req:any) {
        const access_token = req.cookies['access_token'];
        return this.reservationService.allReservationsClient(access_token)
    }

    @Delete('reservations/:id')
    async removeReservationClient(@Request() req:any, @Param('id') idReservation: string) {
        const access_token = req.cookies['access_token'];
        return this.reservationService.removeReservationClient(access_token, idReservation)
    }

}
