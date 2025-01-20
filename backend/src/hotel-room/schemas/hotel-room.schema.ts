import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Hotel } from "../../hotel/schemas/hotel.schema";

export type HotelRoomDocument = HotelRoom & Document

@Schema({timestamps: true})
export class HotelRoom {
    @Prop({required: true})
    description: string

    @Prop({ type: [String], default: []})
    images: string[]

    @Prop({required: true, default: true})
    isEnabled: boolean

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
    hotel: Hotel

}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)