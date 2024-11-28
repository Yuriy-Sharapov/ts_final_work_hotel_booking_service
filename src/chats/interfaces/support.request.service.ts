import { ISendMessageDto } from "src/messages/interfaces/send.message.dto"
import { IGetChatListParams } from "./get.chat.list.params"
import { ISupportRequest } from "./support.request"
import { ID } from "src/types"
import { IMessage } from "src/messages/interfaces/message"

export interface ISupportRequestService {
    findSupportRequests(params: IGetChatListParams): Promise<ISupportRequest[]>
    sendMessage(data: ISendMessageDto): Promise<IMessage>
    getMessages(supportRequest: ID): Promise<IMessage[]>
    subscribe(
      handler: (supportRequest: ISupportRequest, message: IMessage) => void
    ): () => void
}