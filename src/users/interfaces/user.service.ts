import { ID } from 'src/types';
import { ISearchUserParams } from './search.user.params';
import { User, UserDocument } from '../users.schema';

export interface IUserService {
  create(data: Partial<User>): Promise<UserDocument>;
  findById(id: ID): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument>;
  findAll(params: ISearchUserParams): Promise<UserDocument[]>;
}
