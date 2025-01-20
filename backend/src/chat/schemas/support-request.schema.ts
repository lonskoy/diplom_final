import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SupportRequestDoc = SupportRequest & Document;

@Schema({ timestamps: true }) // Автоматически добавляет createdAt и updatedAt
export class SupportRequest extends Document {
  @Prop({ required: true })
  user: string; // ID пользователя

  @Prop({
    type: [
      {
        author: { type: String, required: true }, // ID автора сообщения
        role: { type:String, required: true },
        name: { type:String, required: true },
        sentAt: { type: Date, required: true, default: Date.now }, // Время отправки
        readAt: { type: Date, default: null }, // Время прочтения
        text: { type: String, required: true }, // Текст сообщения
      },
    ],
    default: [],
  })
  messages: {
    author: string;
    role: string;
    name: string;
    sentAt: Date;
    readAt?: Date | null ;
    text: string;
  }[];

  @Prop({ required: true, default: true })
  isActive: boolean; // Статус активности обращения
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);