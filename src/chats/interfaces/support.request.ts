import { ID } from "src/types";
import { IMessage } from "../../messages/interfaces/message";

export interface ISupportRequest{
    id       : ID
    userId   : ID
    createdAt: Date
    messages : IMessage[]
    isActive : Boolean
}