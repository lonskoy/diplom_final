import { Body, Controller, Post, Get, Put, UploadedFiles, UseGuards, UseInterceptors, Param, NotFoundException, UploadedFile, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HotelRoomService } from './hotel-room.service';
import { CreateHoteRoomlDto } from './dto/create-hotel-room.dto';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UpdateHoteRoomlDto } from './dto/update-hotel-room.dto';
import { SearchRoomsParams } from './interfaces/SearchRoomsParams.interface';

@UseGuards(AuthGuard('admin'))
@Controller('admin')
export class HotelRoomController {
    constructor(private readonly hotelRoomService: HotelRoomService) { }

    @Post('hotel-rooms')
    @UseInterceptors(
        FilesInterceptor('images', 10, {

            storage: diskStorage({
                destination: '../img',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, uniqueSuffix);
                }
            }),
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true)
                }
                else {
                    cb(new Error('Неподдерживаемый тип файла изображения'), false)
                }
            }
        })
    )
    async create(
        @Body() data: CreateHoteRoomlDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        console.log(files)
        const imagePath = files.map(file => `img/${file.filename}`)
        return this.hotelRoomService.create({ ...data, images: imagePath });
    }

    @Get('hotel-rooms')
    async findAllRooms(@Query() query: SearchRoomsParams) {
        return await this.hotelRoomService.findAll(query);
    }

    @Get('hotel-rooms/:id')
    async findByIdRooms(@Param('id') id: string) {
        return await this.hotelRoomService.findById(id);
    }


    @Put('hotel-rooms/:id')
    @UseInterceptors(
        FilesInterceptor('images', 10, {

            storage: diskStorage({
                destination: '../img',
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, uniqueSuffix);
                }
            }),
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true)
                }
                else {
                    cb(new Error('Неподдерживаемый тип файла изображения'), false)
                }
            }
        })
    )
    async updateRoomById(@Param('id') id: string, @Body() data: UpdateHoteRoomlDto, @UploadedFile() files: Express.Multer.File[]) {
        return await this.hotelRoomService.updateById(id, data, files || []) // метод НЕ РАБОТАЕТ корректно, по чему то файлы на сервер добавляет, но в сервис передает undefined
    }

}
