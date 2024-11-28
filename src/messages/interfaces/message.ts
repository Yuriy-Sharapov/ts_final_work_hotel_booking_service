import { ID } from "src/types"

export interface IMessage {
    id      : ID
    authorId: ID
    sentAt  : Date
    text    : string
    readAt  : Date
}