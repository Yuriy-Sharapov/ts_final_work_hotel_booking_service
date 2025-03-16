import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User, UserDocument, UserHDocument } from './users.schema';
import { IUserService } from './interfaces/user.service';
import { ISearchUserParams } from './interfaces/search.user.params';
import { IUserAttr } from './interfaces/user.attr';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(data: Partial<User>): Promise<IUserAttr> {
    //u
    const user = new this.userModel(data);
    return user.save();
  }
  async findById(id: ID): Promise<IUserAttr> {
    //u
    return this.userModel.findById(id).exec();
  }
  async findByEmail(email: string): Promise<UserHDocument> {
    //u
    return this.userModel.findOne({ email: email }).exec();
  }
  async findAll(params: ISearchUserParams): Promise<IUserAttr[]> {
    //u
    // При поиске поля email, name и contactPhone должны проверяться на частичное совпадение
    const maskedParams = params;
    if (maskedParams.email) maskedParams.email = `/${maskedParams.email}/`;

    if (maskedParams.name) maskedParams.name = `/${maskedParams.name}/`;

    if (maskedParams.contactPhone)
      maskedParams.contactPhone = `/${maskedParams.contactPhone}/`;

    return this.userModel.find(maskedParams).exec();
  }
}
