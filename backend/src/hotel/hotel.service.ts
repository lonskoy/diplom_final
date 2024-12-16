import { Injectable, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from '../hotel/schemas/hotel.schema'
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelParams } from '../hotel/dto/update-hotel.dto';

@Injectable()
export class HotelService {
    constructor(@InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>) { }

    async create(data: CreateHotelDto): Promise<Hotel | null> {
        try {
            const newHotel = new this.hotelModel(data);
            newHotel.save();
            const editNewHotel = {
                id: newHotel._id,
                title: newHotel.title,
                description: newHotel.description
            }
            console.log('Создан новый отель:', newHotel)
            return editNewHotel
        }
        catch (error: any) {
            console.error('Ошибка при создании отеля:', error)
            throw new Error('Ошибка при создании отеля');
        }
    }

    async findAll(): Promise<Hotel[]> {
        try {
            const hotels =  this.hotelModel.find().exec();
            const hotelsFiltred = (await hotels).map(hotel => ({
                    id: hotel._id,
                    title: hotel.title,
                    description: hotel.description
            }));
            return hotelsFiltred
        } catch (error: any) {
            console.error('Ошибка при получении списка отелей:', error);
            throw new Error('Ошибка при получении списка отелей');
        }
    }

    async findById(@Param() id: string): Promise<Hotel | null> {
        try {
            return this.hotelModel.findById(id).exec();
        } catch (error: any) {
            console.error(`Ошибка при получении отеля с id ${id}:`, error);
            throw new Error('Ошибка при получении отеля');
        }
    }

    async update(id: string, data: UpdateHotelParams): Promise<Hotel | null> {
        try {
            // Используем await, чтобы получить обновленный отель
            const updateHotel = await this.hotelModel.findByIdAndUpdate(id, data, { new: true }).exec();
            
            // Проверяем, был ли найден отель
            if (!updateHotel) {
                console.error(`Отель с id ${id} не найден`);
                return null;
            }
    
            // Создаем отфильтрованный объект с необходимыми полями
            const updateHotelFiltred = {
                id: updateHotel._id,
                title: updateHotel.title,
                description: updateHotel.description,
            };
    
            return updateHotelFiltred;
        } catch (error: any) {
            console.error(`Ошибка при обновлении отеля с id ${id}:`, error);
            throw new Error('Ошибка при обновлении отеля');
        }
    }
}
