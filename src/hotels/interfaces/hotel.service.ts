import { ID } from "src/types"
import { ISearchHotelParams } from "./search.hotel.params"
import { IUpdateHotelParams } from "./update.hotel.params"
import { Hotel, HotelDocument } from "../hotels.schema"

export interface IHotelService {
    create(data: Hotel): Promise<HotelDocument>
    findById(id: ID): Promise<HotelDocument>
    search(params: ISearchHotelParams): Promise<HotelDocument[]>
    update(id: ID, data: IUpdateHotelParams): Promise<HotelDocument>
}