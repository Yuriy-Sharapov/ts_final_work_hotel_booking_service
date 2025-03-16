import { ID } from 'src/types';
import { ISearchUserParams } from './search.user.params';
import { User, UserHDocument } from '../users.schema';
import { IUserAttr } from './user.attr';

export interface IUserService {
  create(data: Partial<User>): Promise<IUserAttr>;
  findById(id: ID): Promise<IUserAttr>;
  findByEmail(email: string): Promise<UserHDocument>;
  findAll(params: ISearchUserParams): Promise<IUserAttr[]>;
}
