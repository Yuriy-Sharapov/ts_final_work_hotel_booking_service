import { ID } from "src/types"
import { IRoom } from "./room"
import { ISearchRoomsParams } from "./search.rooms.params"

export interface IHotelRoomService {
    create(data: Partial<IRoom>): Promise<IRoom>
    findById(id: ID): Promise<IRoom>
    search(params: ISearchRoomsParams): Promise<IRoom[]>
    update(id: ID, data: Partial<IRoom>): Promise<IRoom>
}