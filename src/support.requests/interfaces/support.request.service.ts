import { ISendMessageDto } from 'src/support.requests/interfaces/send.message.dto';
import { ISearchSupportRequestParams } from './search.support.request.params';
import { ID } from 'src/types';
import { SupportRequestDocument } from '../schemas/support.request.schema';
import { MessageDocument } from 'src/support.requests/schemas/messages.schema';

export interface ISupportRequestService {
  findSupportRequests(
    params: ISearchSupportRequestParams,
  ): Promise<SupportRequestDocument[]>;
  sendMessage(data: ISendMessageDto): Promise<MessageDocument>;
  getMessages(supportRequestId: ID): Promise<MessageDocument[]>;
  // subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void
  // ): Promise<() => void>
}
