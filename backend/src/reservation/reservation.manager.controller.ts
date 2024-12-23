import { Controller, Delete, UseGuards, Request, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservationService } from './reservation.service';

@UseGuards(AuthGuard('manager'))
@Controller('manager')
export class ReservationManagerController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get('reservations/:id')
    async allReservationClient(@Param('id') userId: string) {
        return this.reservationService.allReservationsManager(userId)
    }

    @Delete('reservations/:id')
    async removeReservationManager(@Request() req:any, @Param('id') idReservation: string) {
        const access_token = req.cookies['access_token'];
        return this.reservationService.removeReservationManager(idReservation)
    }

}
