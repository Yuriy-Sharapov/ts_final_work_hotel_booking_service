import { IMarkMessagesAsReadDto } from "src/messages/interfaces/mark.messages.as.read.dto"
import { ID } from "src/types"

export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>
    getUnreadCount(supportRequest: ID): Promise<number>
    closeRequest(supportRequest: ID): Promise<void>
}