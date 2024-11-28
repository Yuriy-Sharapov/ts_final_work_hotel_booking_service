import { ID } from "src/types"

export interface ISearchRoomsParams {
    limit     : number
    offset    : number
    hotel     : ID
    isEnabled?: boolean
}