import { ID } from "src/types"

export interface IRoom {
    id          : ID
    hotelId     : ID
    description : string 
    images      : string[]
    createdAt   : Date
    updatedAt   : Date
    isEnabled   : Boolean
}