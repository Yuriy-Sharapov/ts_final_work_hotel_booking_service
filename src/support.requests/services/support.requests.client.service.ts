import { Injectable } from '@nestjs/common';
import { ID, Role } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from '../schemas/support.request.schema';
import { ISupportRequestClientService } from '../interfaces/support.request.client.service';
import { ICreateSupportRequestDto } from '../interfaces/create.support.request.dto';
import { IMarkMessagesAsReadDto } from '../interfaces/mark.messages.as.read.dto';
import { Message } from '../schemas/messages.schema';
import { UsersService } from 'src/users/users.service';
import { IMarkMessagesAsReadAnswer } from '../interfaces/mark.messages.as.read.answer';

@Injectable()
export class SupportRequestsClientService
  implements ISupportRequestClientService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectConnection() private connection: Connection,
    private readonly usersService: UsersService,
  ) {}

  async createSupportRequest(
    data: ICreateSupportRequestDto,
  ): Promise<SupportRequestDocument> {
    //u
    try {
      const sentDate = new Date();
      const user = await this.usersService.findById(data.userId);

      const firstMessage: Message = {
        author: user,
        sentAt: sentDate,
        text: data.text,
        readAt: null,
      };
      const supportRequest: SupportRequest = {
        user: user,
        createdAt: sentDate,
        messages: [firstMessage],
        isActive: true,
      };
      const dbSupportRequest = new this.supportRequestModel(supportRequest);
      return dbSupportRequest.save();
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  async markMessagesAsRead(
    params: IMarkMessagesAsReadDto,
  ): Promise<IMarkMessagesAsReadAnswer> {
    //u

    // Должен выставлять текущую дату в поле readAt всем сообщениям,
    // которые ранее не были прочитаны и были отправлены не пользователем

    const date = new Date();

    try {
      await this.supportRequestModel.findOneAndUpdate(
        {
          _id: params.supportRequestId,
          $ne: { 'messages.author.role': Role.client }, // были отправлены не пользователем
          $lte: { 'messages.sentAt': params.createdBefore },
          'messages.readAt': null, // ранее не были прочитаны
        },
        { readAt: date },
      );

      return { success: true };
    } catch (e) {
      console.log(e);
      return { success: false };
    }
  }
  async getUnreadCount(supportRequest: ID): Promise<number> {
    //u
    // должен возвращать количество сообщений,
    // которые были отправлены любым сотрудником поддержки и не отмечены прочитанным
    return this.supportRequestModel.findById(supportRequest).countDocuments({
      'messages.readAt': null,
      'messages.author.role': Role.manager, // отправлены сотрудником поддержки
    });
  }
}
