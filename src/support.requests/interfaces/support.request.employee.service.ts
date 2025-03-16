import { IMarkMessagesAsReadDto } from 'src/support.requests/interfaces/mark.messages.as.read.dto';
import { ID } from 'src/types';
import { IMarkMessagesAsReadAnswer } from './mark.messages.as.read.answer';

export interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<IMarkMessagesAsReadAnswer>;
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}
