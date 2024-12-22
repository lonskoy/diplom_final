import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })  // Ссылка на коллекцию "User"
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Hotel' })  // Ссылка на коллекцию "Hotel"
    hotelId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Room' })  // Ссылка на коллекцию "Room"
    roomId: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    dateStart: Date;

    @Prop({ required: true })
    dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);