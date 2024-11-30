import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Room, RoomDocument } from './rooms.schema';
import { IHotelRoomService } from './interfaces/hotel.room.service';
import { ISearchRoomsParams } from './interfaces/search.rooms.params';

@Injectable()
export class RoomsService implements IHotelRoomService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    async create(data: Partial<Room>): Promise<RoomDocument> {
        data.createdAt = new Date()
        data.updatedAt = null
        const room = new this.roomModel(data)
        return room.save() 
    }
    async findById(id: ID): Promise<RoomDocument>{
        return this.roomModel.findById(id).exec()
    }
    async search(params: ISearchRoomsParams): Promise<RoomDocument[]>{
        return this.roomModel.find(params).exec()
    }
    async update(id: ID, data: Partial<Room>): Promise<RoomDocument>{
        const room ={
            ... data,
            updatedAt: new Date()
        }
        return this.roomModel.findOneAndUpdate(
            { _id: id },
            room,
            { new: true }  // нужно, чтобы return вернул уже обновленные данные по номеру отеляы
        )         
    }
}
