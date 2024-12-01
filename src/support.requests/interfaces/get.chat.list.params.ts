import { ID } from "src/types";

export interface IGetChatListParams {
    userId  : ID | null;
    isActive: boolean;
}