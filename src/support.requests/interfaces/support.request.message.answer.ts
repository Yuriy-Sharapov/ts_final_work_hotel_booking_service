import { ID } from "src/types";

export interface ISupportRequestMessageAnswer {
    id       : ID,
    createdAt: Date,
    text     : string,
    readAt   : Date,
    author   : {
        id  : ID,
        name: string
    }
}
