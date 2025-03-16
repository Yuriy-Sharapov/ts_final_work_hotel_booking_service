import { ID } from 'src/types';
import { SupportRequestDocument } from '../schemas/support.request.schema';
import { ICreateSupportRequestDto } from './create.support.request.dto';
import { IMarkMessagesAsReadDto } from 'src/support.requests/interfaces/mark.messages.as.read.dto';
import { IMarkMessagesAsReadAnswer } from './mark.messages.as.read.answer';

export interface ISupportRequestClientService {
  createSupportRequest(
    data: ICreateSupportRequestDto,
  ): Promise<SupportRequestDocument>;
  markMessagesAsRead(
    params: IMarkMessagesAsReadDto,
  ): Promise<IMarkMessagesAsReadAnswer>;
  getUnreadCount(supportRequest: ID): Promise<number>;
}
