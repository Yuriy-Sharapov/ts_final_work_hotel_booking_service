import { ID } from "src/types"

export interface IReservationSearchOptions {
    userId   : ID
    dateStart: Date
    dateEnd  : Date
}