import { ID } from "src/types"

export interface IHotel {
    id          : ID
    title       : string
    description : string
    createdAt   : Date
    updatedAt   : Date
}