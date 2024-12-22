import { IsString, IsNotEmpty, IsArray, IsBoolean, IsOptional } from 'class-validator'


export class CreateHoteRoomlDto {
  @IsString()
  @IsNotEmpty()
  description: string

  @IsArray()
  @IsOptional()
  @IsString({each: true})
  images: string[]

  @IsBoolean()
  @IsOptional()
  isEnabled: boolean

  @IsString()
  @IsNotEmpty()
  hotel: string
}
