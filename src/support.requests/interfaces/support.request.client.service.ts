import { ID } from 'src/types';
import { SupportRequestDocument } from '../schemas/support.requests.schema';
import { ICreateSupportRequestDto } from './create.support.request.dto';
import { IMarkMessagesAsReadDto } from 'src/support.requests/interfaces/mark.messages.as.read.dto';

export interface ISupportRequestClientService {
  createSupportRequest(
    data: ICreateSupportRequestDto,
  ): Promise<SupportRequestDocument>;
  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void>;
  getUnreadCount(supportRequest: ID): Promise<number>;
}
