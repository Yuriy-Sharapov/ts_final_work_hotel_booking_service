import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from 'mongoose'
import { Hotel } from "src/hotels/hotels.schema";

//export type RoomDocument = Room & Document
export type RoomDocument = HydratedDocument<Room>

@Schema()
export class Room {
    
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'  })
    public hotelId: Hotel

    @Prop()
    public description: string 

    @Prop({ type: [String] })
    public images: string[]

    @Prop({ required: true })
    public createdAt: Date

    @Prop()
    public updatedAt: Date

    @Prop({ required: true, default: true })
    public isEnabled: Boolean           // номер доступен или зарезервирован
}

export const RoomSchema = SchemaFactory.createForClass(Room)