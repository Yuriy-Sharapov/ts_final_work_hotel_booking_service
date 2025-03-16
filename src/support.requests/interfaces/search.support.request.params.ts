import { ID } from 'src/types';

export interface ISearchSupportRequestParams {
  limit: number;
  offset: number;
  userId: ID | null;
  isActive: boolean;
}
