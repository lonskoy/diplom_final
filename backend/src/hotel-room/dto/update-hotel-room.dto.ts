import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator'


export class UpdateHoteRoomlDto {
  @IsString()
  @IsNotEmpty()
  description: string

  @IsArray()
  @IsOptional()
  @IsString({each: true})
  images: string[]

}