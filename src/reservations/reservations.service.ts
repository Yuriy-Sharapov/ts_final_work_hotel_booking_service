import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservations.schema';
import { IReservationService } from './interfaces/reservation.service';
import { IReservationSearchOptions } from './interfaces/reservation.search.options';
import { IReservationDto } from './interfaces/reservation.dto';

@Injectable()
export class ReservationsService implements IReservationService {
    constructor(
        @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    async addReservation(data: IReservationDto): Promise<ReservationDocument>{
        // Метод должен проверять, доступен ли номер на заданную дату.
        // Проверим есть ли пересечения запрашиваемых дат с уже существующими бронированиями
        // для запрашиваемого номера отеля
        const checkAlreadyBookedConditions = {
            $and: [
                { hotelId: data.hotelId },
                { roomId:  data.roomId },
                {   
                    $ne: {  // делаем отрицание того, когда существующие бронирования не пересекаются с запрашиваемым
                        $or:[  // описываем условия, когда существующие бронирования не пересекаются с запрашиваемым
                            { dateStart: { $gt: data.dateEnd}   },  // существующие бронирования после запрашиваемого
                            { dateEnd  : { $lt: data.dateStart} }   // существующие бронирования до запрашиваемого
                        ]
                    }
                }
            ]
        }
        let alreadyBooked: boolean
        try {
            if(await this.reservationModel.countDocuments(checkAlreadyBookedConditions, { limit: 1 }) > 0)
                alreadyBooked = true
            else
                alreadyBooked = false
        } catch(e) {
            console.log(e)
            return null
        }

        if (!alreadyBooked){
            const userDateStart = data.dateStart.toLocaleDateString()
            const userdateEnd = data.dateEnd.toLocaleDateString()

            console.log(`Номер на даты ${userDateStart} - ${userdateEnd} уже забронирован`)
            return null
        }

        const reservation = new this.reservationModel(data)
        return reservation.save()
    }
    async removeReservation(id: ID): Promise<void>{
        return this.reservationModel.findOneAndDelete({ _id: id })
    }
    async getReservations(filter: IReservationSearchOptions): Promise<Array<ReservationDocument>>{

        const allUsefilterrReservation = {
            $and: [
                { userId: filter.userId },
                {                      
                    $ne: {  // делаем отрицание того, когда существующие бронирования не пересекаются с запрашиваемым
                        $or:[  // описываем условия, когда существующие бронирования не пересекаются с запрашиваемым
                            { dateStart: { $gt: filter.dateEnd}   },  // существующие бронирования после запрашиваемого
                            { dateEnd  : { $lt: filter.dateStart} }   // существующие бронирования до запрашиваемого
                        ]
                    }
                }
            ]
        }
        return this.reservationModel.find(allUsefilterrReservation).exec()
    }
}
