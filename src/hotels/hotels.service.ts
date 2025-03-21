import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Hotel, HotelDocument } from './hotels.schema';
import { IHotelService } from './interfaces/hotel.service';
import { ISearchHotelParams } from './interfaces/search.hotel.params';
import { IUpdateHotelParams } from './interfaces/update.hotel.params';

import fs from 'fs';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: Partial<Hotel>): Promise<HotelDocument> {
    //u
    data.createdAt = new Date();
    data.updatedAt = null;
    const hotel = new this.hotelModel(data);
    return hotel.save();
  }
  async findById(id: ID): Promise<HotelDocument> {
    return this.hotelModel.findById(id).exec();
  }
  async search(params: ISearchHotelParams): Promise<HotelDocument[]> {
    //u
    const maskedParams = params;
    if (maskedParams.title) maskedParams.title = `/${maskedParams.title}/`;
    return this.hotelModel.find(maskedParams).exec();
  }
  async update(id: ID, data: IUpdateHotelParams): Promise<HotelDocument> {
    //u
    const hotel = {
      title: data.title,
      description: data.description,
      updatedAt: new Date(),
    };
    return this.hotelModel.findOneAndUpdate(
      { _id: id },
      hotel,
      { new: true }, // нужно, чтобы return вернул уже обновленные данные по отелю
    );
  }

  load_db_preload() {
    const jsonString = fs.readFileSync('../../dbpreload_hotels.json', 'utf-8');
    const hotels = JSON.parse(jsonString);

    hotels.forEach((hotel) => {
      this.create(hotel);
    });
  }
}
