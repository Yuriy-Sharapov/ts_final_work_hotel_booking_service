import { ID } from 'src/types';

export interface IMarkMessagesAsReadDto {
  userId          : ID;
  supportRequestId: ID;
  createdBefore   : Date;
}
