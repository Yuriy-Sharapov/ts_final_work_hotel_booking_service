import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

//export type HotelDocument = Hotel & Document
export type HotelDocument = HydratedDocument<Hotel>;

@Schema()
export class Hotel {
  @Prop({
    required: true,
    unique: true,
  })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
