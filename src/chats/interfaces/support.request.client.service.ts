import { ID } from "src/types"
import { ICreateSupportRequestDto } from "./create.support.request.dto"
import { IMarkMessagesAsReadDto } from "src/messages/interfaces/mark.messages.as.read.dto"
import { ISupportRequest } from "./support.request"

export interface ISupportRequestClientService {
    createSupportRequest(data: ICreateSupportRequestDto): Promise<ISupportRequest>
    markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>
    getUnreadCount(supportRequest: ID): Promise<number>
}