import { ID } from "src/types";

export interface IGetChatListParams {
    user    : ID | null;
    isActive: boolean;
}