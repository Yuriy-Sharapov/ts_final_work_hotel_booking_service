import { ID } from "src/types";

export interface IMarkMessagesAsReadDto {
    user          : ID
    supportRequest: ID
    createdBefore : Date
}