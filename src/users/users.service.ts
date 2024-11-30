import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Connection, Model } from 'mongoose';
import { IUserService } from './interfaces/user.service';
import { ISearchUserParams } from './interfaces/search.user.params';

@Injectable()
export class UsersService implements IUserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection
    ) {}

    async create(data: Partial<User>): Promise<UserDocument> {
        const user = new this.userModel(data)
        return user.save()
    }
    async findById(id: ID): Promise<UserDocument> {
        return this.userModel.findById(id).exec()
    }
    async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email: email }).exec()
    }
    async findAll(params: ISearchUserParams): Promise<UserDocument[]> {

        // При поиске поля email, name и contactPhone должны проверяться на частичное совпадение
        let maskedParams = params
        if (maskedParams.email)
            maskedParams.email = `/${maskedParams.email}/`
        
        if (maskedParams.name)
            maskedParams.name = `/${maskedParams.name}/`

        if (maskedParams.contactPhone)
            maskedParams.contactPhone = `/${maskedParams.contactPhone}/`

        return this.userModel.find(maskedParams).exec()
    }
}