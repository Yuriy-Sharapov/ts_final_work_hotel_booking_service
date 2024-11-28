import { ID } from "src/types";
import { IReservation } from "./reservation";
import { IReservationDto } from "./reservation.dto";
import { IReservationSearchOptions } from "./reservation.search.options";

export interface IReservationService {
    addReservation(data: IReservationDto): Promise<IReservation>;
    removeReservation(id: ID): Promise<void>;
    getReservations(
      filter: IReservationSearchOptions
    ): Promise<Array<IReservation>>;
}