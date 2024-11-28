import { ID } from "src/types"

export interface ISendMessageDto {
    author        : ID
    supportRequest: ID
    text          : string
  }