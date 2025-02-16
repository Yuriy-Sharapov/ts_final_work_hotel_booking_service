import { ISendMessageDto } from 'src/support.requests/interfaces/send.message.dto';
import { IGetChatListParams } from './get.chat.list.params';
import { ID } from 'src/types';
import { SupportRequestDocument } from '../schemas/support.requests.schema';
import { MessageDocument } from 'src/support.requests/schemas/messages.schema';

export interface ISupportRequestService {
  findSupportRequests(
    params: IGetChatListParams,
  ): Promise<SupportRequestDocument[]>;
  sendMessage(data: ISendMessageDto): Promise<MessageDocument>;
  getMessages(supportRequestId: ID): Promise<MessageDocument[]>;
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void
  // ): () => void
}
