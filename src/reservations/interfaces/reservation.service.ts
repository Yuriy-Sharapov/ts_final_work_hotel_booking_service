import { ID } from "src/types";
import { IReservationDto } from "./reservation.dto";
import { IReservationSearchOptions } from "./reservation.search.options";
import { ReservationDocument } from "../reservations.schema";

export interface IReservationService {
    addReservation(data: IReservationDto): Promise<ReservationDocument>;
    removeReservation(id: ID): Promise<void>;
    getReservations(
      filter: IReservationSearchOptions
    ): Promise<Array<ReservationDocument>>;
}