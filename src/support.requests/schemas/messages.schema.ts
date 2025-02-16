import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/users.schema';

export type MessageDocument = HydratedDocument<Message>;
//export type MessageDocument = Message & Document

@Schema()
export class Message {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public author: User;

  @Prop({ required: true })
  public sentAt: Date;

  @Prop({ required: true })
  public text: string;

  @Prop()
  public readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
