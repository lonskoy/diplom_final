import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HotelDocument = HydratedDocument<Hotel>;

@Schema({timestamps: true})  // timestamps автоматически создает и управляет полями createdAt и updatedAt
export class Hotel {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

}

export const HotelSchema = SchemaFactory.createForClass(Hotel);