import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as mongoose from 'mongoose'

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema({timestamps: true})
export class HotelRoom {
    @Prop({required: true})
    description: string

    @Prop({ type: [String], default: []})
    images: string[]

    @Prop({required: true, default: true})
    isEnabled: boolean

    @Prop({
        type: {
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
        },
        required: true,
    })
    hotel: {
        id: string;
        title: string;
        description: string;
    };

    // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }) // Ссылка на Hotel
    // hotel: mongoose.Types.ObjectId;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom)