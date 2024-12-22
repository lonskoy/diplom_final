import { IsString, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';  // Импортируем декоратор

export class ReservationDto {

    @IsString()
    @IsNotEmpty()
    hotelRoom: string; 

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dateStart: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dateEnd: Date;
}