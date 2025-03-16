import { Injectable } from '@nestjs/common';
import { ID } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from '../schemas/support.request.schema';
import {
  Message,
  MessageDocument,
} from 'src/support.requests/schemas/messages.schema';
import { ISupportRequestService } from '../interfaces/support.request.service';
import { ISendMessageDto } from 'src/support.requests/interfaces/send.message.dto';
import { UsersService } from 'src/users/users.service';
import { ISearchSupportRequestParams } from '../interfaces/search.support.request.params';
import { SupportRequestsGateway } from '../support.requests.gateway';

@Injectable()
export class SupportRequestsService implements ISupportRequestService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectConnection() private connection: Connection,
    private readonly usersService: UsersService,
    private readonly supportRequestsGateway: SupportRequestsGateway,
  ) {}

  async findSupportRequests(
    params: ISearchSupportRequestParams,
  ): Promise<SupportRequestDocument[]> {
    //u
    try {
      return await this.supportRequestModel.find(params).exec();
    } catch (e) {
      console.log(e);
    }
  }
  async findById(id: ID): Promise<SupportRequestDocument> {
    //u
    return this.supportRequestModel.findById(id).exec();
  }
  async sendMessage(data: ISendMessageDto): Promise<MessageDocument> {
    //u
    try {
      const author = await this.usersService.findById(data.authorId);
      const message: Message = {
        author: author,
        sentAt: new Date(),
        text: data.text,
        readAt: null,
      };

      // добавляем объект во вложенный список сообщений
      await this.supportRequestModel.findOneAndUpdate(
        { _id: data.supportRequestId },
        { $push: { messages: message } },
      );

      // // Получаем объект Обращения в поддержку
      // let supportRequest = await this.supportRequestModel.findById(data.supportRequestId).exec()

      // // Сохраняем новое сообщение в коллекцию сообщений текущего Обращения в поддержку
      // supportRequest.messages.push(message)
      // await supportRequest.save()

      // // Получаем из БД объект сообщения
      // const dbMessage: MessageDocument =
      //     await supportRequest.populate({
      //         path: 'messages',
      //         match: {
      //             author: message.author,
      //             sentAt: message.sentAt
      //         }
      //     })

      return await this.messageModel.findOne({
        author: message.author,
        sentAt: message.sentAt,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async getMessages(supportRequestId: ID): Promise<MessageDocument[]> {
    //u
    let supportRequest: any;
    try {
      supportRequest = await this.supportRequestModel
        .findById(supportRequestId)
        .populate('messages')
        .exec();
    } catch (e) {
      console.log(e);
      return null;
    }
    return supportRequest.messages;
  }
  // async subscribe(
  //   handler: (supportRequest: SupportRequest, message: Message) => void
  // ): Promise<() => void> {

  // }
}
