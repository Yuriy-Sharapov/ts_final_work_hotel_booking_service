import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/users.schema';
import { Hotel } from 'src/hotels/hotels.schema';
import { Room } from 'src/rooms/rooms.schema';

// export type ReservationDocument = Reservation & Document
export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public userId: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
  public hotelId: Hotel;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  public roomId: Room;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
