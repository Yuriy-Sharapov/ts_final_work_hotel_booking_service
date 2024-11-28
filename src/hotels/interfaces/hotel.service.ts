import { ID } from "src/types"
import { IHotel } from "./hotel"
import { ISearchHotelParams } from "./search.hotel.params"
import { IUpdateHotelParams } from "./update.hotel.params"

export interface IHotelService {
    create(data: any): Promise<IHotel>
    findById(id: ID): Promise<IHotel>
    search(params: ISearchHotelParams): Promise<IHotel[]>
    update(id: ID, data: IUpdateHotelParams): Promise<IHotel>
}