import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from 'mongoose'
import { Role } from '../types'

//export type UserDocument = User & Document
export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    
    @Prop({
        required: true,
        unique:   true
    })
    public email: string

    @Prop({ required: true })
    public passwordHash: string

    @Prop({ required: true })
    public name: string

    @Prop()
    public contactPhone: string

    @Prop({
        required: true,
        default : Role.client
    })
    public role: string
}

export const UserSchema = SchemaFactory.createForClass(User)