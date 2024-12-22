import { InjectModel } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { Hotel, HotelDocument } from '../hotel/schemas/hotel.schema'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateHoteRoomlDto } from './dto/create-hotel-room.dto';
import { UpdateHoteRoomlDto } from './dto/update-hotel-room.dto';

@Injectable()
export class HotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,
        @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>
    ) { }

    async create(data: CreateHoteRoomlDto): Promise<any> {
        const hotelFind = await this.hotelModel.findById(data.hotel);
        if (!hotelFind) {
            throw new Error('Отель не найден');
        }

        const hotelData = {
            id: hotelFind.id,
            title: hotelFind.title,
            description: hotelFind.description
        }


        // Создаем новый номер
        const newRoom = new this.hotelRoomModel({
            description: data.description,
            images: data.images || [], // Пустой массив по умолчанию
            isEnabled: data.isEnabled ?? true, // Используем isEnable из DTO
            hotel: hotelData, // Используем ID отеля
        });

        // Сохраняем номер
        return await newRoom.save();

        // // Популяция отеля
        // const populatedRoom = hotelFind.populate({
        //     path: 'hotel', // Указываем путь для популяции
        //     select: 'title description' // Указываем поля для популяции (title, description)
        // })  

        // return {
        //     id: populatedRoom.id.toString(),
        //     description: populatedRoom.description,
        //     images: populatedRoom.images,
        //     isEnabled: populatedRoom.isEnabled,
        //     hotel: {
        //         id: populatedRoom._id.toString(),
        //         title: populatedRoom.title, // Получаем title отеля
        //         description: populatedRoom.description, // Получаем description отеля
        //     },
        // };
    }

    async findAll() {
        try {
            return await this.hotelRoomModel.find();
        } catch (error) {
            console.error('Ошибка при поиске всех номеров:', error);
            throw new InternalServerErrorException('Не удалось получить список номеров');
        }
    }

    async findById(id: string) {
        try {
            const room = await this.hotelRoomModel.findById(id);
            if (!room) {
                throw new NotFoundException(`Комната с ID ${id} не найдена`);
            }
            return room;
        } catch (error) {
            console.log('Ошибка при поиски номера по id', error)
        }
    }

    async updateById(
        id: string,
        data: UpdateHoteRoomlDto,
        files: Express.Multer.File[]
    ) {
        try {
            const room = await this.hotelRoomModel.findById(id);
            if (!room) {
                throw new NotFoundException(`Комната с id: ${id} не найдена`)
            }
            const existingImages = room.images || [];
  
            const newImages = files.map(file => `img/${file.filename}`);
            console.log(`Переданные новые картинки ${newImages}`);

            const allImage = [...existingImages, ...newImages];
            const updateRoom = await this.hotelRoomModel.findByIdAndUpdate(
                id,
                {
                    description: data.description,
                    images: allImage,
                },
                { new: true }
            );

            return updateRoom;

        } catch (error) {
            console.error('Ошибка при обновлении номера:', error);
            throw new BadRequestException('Не удалось обновить номер');
        }
    }


}


