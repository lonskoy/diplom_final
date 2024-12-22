import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Reservation, ReservationDocument } from './schemas/reservation.shema';
import { HotelRoom, HotelRoomDocument} from '../hotel-room/schemas/hotel-room.schema'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ReservationDto } from './dto/create-booking.dto';

@Injectable()
export class ReservationService {
    constructor(
        @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
        @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,
        private jwtService: JwtService
    ) {} 

    async create(data: ReservationDto, access_token: string) {
        const room = await this.hotelRoomModel.findById(data.hotelRoom);
        if(!room) {
            throw new NotFoundException(`Комната с id: ${data.hotelRoom} не найдена`)
        }
        let userId;
        try {
            const decoded = this.jwtService.verify(access_token); // Расшифровка JWT токена
            userId = decoded.id
        } catch (error) {
            throw new NotFoundException('Invalid token');
        }

        const dataReservation = {
            userId: userId.toString,
            hotelId: room.hotel.id,
            roomId: room.id,
            dateStart: data.dateStart,
            dateEnd: data.dateEnd

        }

        const newReservation = (await this.reservationModel.create(dataReservation)).save

        return {
            startDate: dataReservation.dateStart,
            endDate: dataReservation.dateEnd,
            hotelRoom: {
                description: room.description,
                images: room.images
            },
            hotel: {
                title: room.hotel.title,
                description: room.hotel.description
            }
        }
        
    }
 
    async allReservationClient(access_token: string) {
        let userId;
        try {
            const decoded = this.jwtService.verify(access_token); // Расшифровка JWT токена
            userId = decoded.id
        } catch (error) {
            throw new NotFoundException('Invalid token');
        }
        const allReservation = await this.reservationModel.find();
        console.log(allReservation);
        const allReservationClient = allReservation.filter(item => item.userId.toString() === userId )
        return allReservationClient;
    }

    async removeReservationClient( access_token: string, idReservation: string,) {
        let userId;
        try {
            const decoded = this.jwtService.verify(access_token); // Расшифровка JWT токена
            userId = decoded.id
            console.log(`УДАЛЕНИЕ БРОНИРОВАНИЯ id клиента: ${userId}`)
        } catch (error) {
            throw new NotFoundException('Invalid token');
        }

        const reservation = await this.reservationModel.findById(idReservation)
        if(!reservation) {
            throw new NotFoundException(`Резервирование id: ${idReservation} не найдено`);
        }
        console.log(`БРОНИРОВАНИЕ: ${reservation}`)
        
        if(reservation.userId === userId){
            await this.reservationModel.findByIdAndDelete(idReservation)
            console.log(`Бронирование id: ${idReservation} было удалено`)
        }
        else {
            throw new NotFoundException(`Резервирование id: ${idReservation} не пренадлежит пользователю id: ${userId}`);
        }
    }

}
