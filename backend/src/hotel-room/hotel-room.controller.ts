import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HotelRoomService } from './hotel-room.service';
import { CreateHoteRoomlDto } from './dto/create-hotel-room.dto';

import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';

@UseGuards(AuthGuard('admin'))
@Controller('admin')
export class HotelRoomController {
    constructor(private readonly hotelRoomService: HotelRoomService) {}     

    @Post('hotel-rooms')
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: join(__dirname, '..','img'),
                filename: (req, file, cb) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`;
                    cb(null, uniqueSuffix);
                }
            }),
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg'];
                if(allowedTypes.includes(file.mimetype)) {
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
         const imagePath = files.map(file => `/img/${file.filename}`)   
         return this.hotelRoomService.create({...data, images: imagePath});
    }

}
