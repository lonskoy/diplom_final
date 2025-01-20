import { Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HotelRoom, HotelRoomDocument } from '../hotel-room/schemas/hotel-room.schema'
import { Reservation, ReservationDocument } from '../reservation/schemas/reservation.shema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { Response } from 'express';
import { FindRoomsOnData } from '../users/dto/find-rooms.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    private readonly jwtServise: JwtService
  ) { }

  async create(data: RegisterDto, response: Response) {
    const { password, ...otherData } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...otherData, passwordHash });
    await newUser.save();

    const access_token = this.jwtServise.sign({ id: newUser._id }); // Генерация токена

    // Установка cookie с access_token
    response.setHeader(
      'Set-Cookie',
      cookie.serialize('access_token', String(access_token), {
        maxAge: 3600,
        domain: 'localhost',
        path: '/',
      })
    );

    // Возврат имени пользователя на frontend
    return response.status(201).json({ userName: newUser.name })
  }

  async allRooms(): Promise<
    {
      description: string;
      images: string[];
      hotel: {
        id: string;
        title: string;
        description: string;
      } | null;
    }[]
  > {
    const data = await this.roomModel.find().populate('hotel');
    console.log(data);
    return data.map(room => ({
      description: room.description,
      images: room.images,
      hotel: room.hotel ? {
        id: String(room.hotel?._id) || '',
        title: room.hotel?.title || '',
        description: room.hotel?.description || ''
      } : null,
    }));
  }

  async findRoomsOnData(data: FindRoomsOnData) {
    console.log(data);
    const allReservations = await this.reservationModel.find().exec();
    const allRooms = await this.roomModel.find().populate('hotel');

    const reservationRooms = new Set<string>(); // Используем Set для уникальных значений

    // Сравниваем даты и находим пересечения
    for (const reservation of allReservations) {
      const resStart = new Date(reservation.dateStart).getTime();
      const resEnd = new Date(reservation.dateEnd).getTime();
      const dataStart = new Date(data.dateStart).getTime();
      const dataEnd = new Date(data.dateEnd).getTime();

      // Проверка на пересечение интервалов
      const isOverlap = resStart <= dataEnd && resEnd >= dataStart;
      if (isOverlap) {
        reservationRooms.add(reservation.roomId.toString()); // Добавляем в Set
      }
    }

    // Фильтруем комнаты, исключая те, которые забронированы
    const reservationRoomsArray = Array.from(reservationRooms);
    console.log(`Id зарезервированных комнат: ${reservationRoomsArray} `)
    const availableRooms = allRooms.filter(room => !reservationRooms.has(room.id));

    return availableRooms;
  }

  async findRoomById(id: string) {
    return this.roomModel.findById(id);
  }

}