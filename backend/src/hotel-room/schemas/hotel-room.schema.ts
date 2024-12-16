import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose'

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema({timestamps: true})
export class HotelRoom {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }) // Ссылка на Hotel
    hotel: mongoose.Types.ObjectId;

    @Prop()
    description: string

    @Prop({default: []})
    images: string[]

    @Prop({required: true, default: true})
    isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)