import { ID } from 'src/types';

export interface ISupportRequestClientAnswer {
  id: ID;
  createdAt: Date;
  isActive: boolean;
  hasNewMessages: boolean;
}
