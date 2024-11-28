import { ID } from "src/types"

export interface IReservation {
    id       : ID
    userId   : ID
    hotelId  : ID
    roomId   : ID
    dateStart: Date
    dateEnd  : Date
}