import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/users.schema';
import { Message } from 'src/support.requests/schemas/messages.schema';

export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema()
export class SupportRequest {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ required: true })
  public createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  public messages: Message[];

  @Prop()
  public isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
