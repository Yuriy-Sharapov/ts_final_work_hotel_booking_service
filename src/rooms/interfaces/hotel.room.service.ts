import { ID } from "src/types"
import { ISearchRoomsParams } from "./search.rooms.params"
import { Room, RoomDocument } from "../rooms.schema"

export interface IHotelRoomService {
    create(data: Partial<Room>): Promise<RoomDocument>
    findById(id: ID): Promise<RoomDocument>
    search(params: ISearchRoomsParams): Promise<RoomDocument[]>
    update(id: ID, data: Partial<Room>): Promise<RoomDocument>
}