import { ID } from 'src/types';

export interface ISendMessageDto {
  authorId        : ID;
  supportRequestId: ID;
  text            : string;
}
