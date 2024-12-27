import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { HotelRoom, HotelRoomDocument } from '../hotel-room/schemas/hotel-room.schema'
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';
import { Response } from 'express';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(HotelRoom.name) private roomModel: Model<HotelRoomDocument>,
    private readonly jwtServise: JwtService
  ) {}

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
      };
    }[]
  > {
    const data = await this.roomModel.find();
    return data.map(room => ({
      description: room.description,
      images: room.images,
      hotel: {
        id: room.hotel?.id ?? '',
        title: room.hotel?.title ?? '',
      },
    }));
  }
}