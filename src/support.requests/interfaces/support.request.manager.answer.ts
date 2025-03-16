import { ID } from 'src/types';
import { IUserAttr } from 'src/users/interfaces/user.attr';

export interface ISupportRequestManagerAnswer {
  id: ID;
  createdAt: Date;
  isActive: boolean;
  hasNewMessages: boolean;
  client: IUserAttr;
}
