import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDoc = Hotel & Document

@Schema({timestamps: true})  // timestamps автоматически создает и управляет полями createdAt и updatedAt
export class Hotel extends Document {

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  text: string;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);