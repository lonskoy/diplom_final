import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';  // Импортируем декоратор

export class FindRoomsOnData {

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dateStart: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    dateEnd: Date;
}