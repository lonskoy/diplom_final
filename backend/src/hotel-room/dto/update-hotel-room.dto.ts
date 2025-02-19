import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator'


export class UpdateHoteRoomlDto {
  @IsString()
  @IsOptional()
  description: string

  @IsArray()
  @IsOptional()
  @IsString({each: true})
  images: string[]

  @IsString()
  @IsOptional()
  imageUrl: string

}