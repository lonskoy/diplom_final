import { InjectModel } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';
import { Hotel, HotelDoc } from '../hotel/schemas/hotel.schema'
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Param, UploadedFile } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateHoteRoomlDto } from './dto/create-hotel-room.dto';
import { UpdateHoteRoomlDto } from './dto/update-hotel-room.dto';
import { SearchRoomsParams } from './interfaces/SearchRoomsParams.interface';

@Injectable()
export class HotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>,
        @InjectModel(Hotel.name) private hotelModel: Model<HotelDoc>
    ) { }

    async create(data: CreateHoteRoomlDto): Promise<any> {
        const hotelFind = await this.hotelModel.findById(data.hotel);
        if (!hotelFind) {
            throw new Error('Отель не найден');
        }

        // Создаем новый номер
        const newRoom = new this.hotelRoomModel({
            description: data.description,
            images: data.images || [], // Пустой массив по умолчанию
            isEnabled: data.isEnabled ?? true, // Используем isEnable из DTO
            hotel: hotelFind._id, // Используем ID отеля
        });

        // Сохраняем номер
        return await newRoom.save();
    }

    async findAll(query: SearchRoomsParams): Promise<any> {
        try {
            const { hotel, isEnabled, offset, limit } = query;

            // Формирование фильтров
            const filters: any = {};
            if (hotel) filters.hotel = hotel; // Фильтр по hotel
            if (typeof isEnabled === 'boolean') filters.isEnabled = isEnabled; // Фильтр по isEnabled

            // Поиск записей с учетом фильтров, пагинации
            const hotelRooms = await this.hotelRoomModel
                .find(filters)
                .skip(offset || 0)
                .limit(limit || 10)
                .exec();

            // Преобразование результата
            return hotelRooms.map(room => ({
                id: room.id,
                description: room.description,
                images: room.images,
                hotel: {
                    id: room.hotel._id,
                    title: room.hotel.title,
                },
            }));

        } catch (error) {
            console.error('Ошибка при поиске всех номеров:', error);
            throw new InternalServerErrorException('Не удалось получить список номеров');
        }
    }

    async findById(id: string) {
        try {
            return this.hotelRoomModel.findById(id).populate('hotel') // в свойство метода populate вбиваем название ключа.
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
            console.log(data, id);
            const room = await this.hotelRoomModel.findById(id);
            if (!room) {
                throw new NotFoundException(`Комната с id: ${id} не найдена`)
            }

            if(data.imageUrl) {   // удаляем картинку по кнопке
                console.log('Зашел в условие ')
                await this.hotelRoomModel.updateOne(
                    {_id: id},
                    { $pull: { images: data.imageUrl  } }
                );
                return
                  
            }

            const existingImages = room.images || [];

            const newImages = files.map(file => `http://localhost:3000/uploads/${file.filename}`);
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


