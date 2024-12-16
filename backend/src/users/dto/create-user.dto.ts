import { IsString, IsNotEmpty, IsEmail } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    contactPhone: string;

    @IsNotEmpty()
    @IsString()
    role: string;

}