import { Injectable } from '@nestjs/common';
import { ID, Role } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schemas/support.requests.schema';
import { ISupportRequestEmployeeService } from './interfaces/support.request.employee.service';
import { IMarkMessagesAsReadDto } from './interfaces/mark.messages.as.read.dto';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<void> {
    const date = new Date();

    try {
      await this.supportRequestModel.findOneAndUpdate(
        {
          _id: params.supportRequestId,
          'messages.author.role': Role.client, // были отправлены пользователем
          $lte: { 'messages.sentAt': params.createdBefore },
          'messages.readAt': null, // ранее не были прочитаны
        },
        { readAt: date },
      );
    } catch (e) {
      console.log(e);
    }
  }
  async getUnreadCount(supportRequestId: ID): Promise<number> {
    // должен возвращать количество сообщений,
    // которые были отправлены пользователем и не отмечены прочитанными.
    return this.supportRequestModel.findById(supportRequestId).countDocuments({
      'messages.readAt': null,
      'messages.author.role': Role.client, // отправлены пользователем
    });
  }
  async closeRequest(supportRequestId: ID): Promise<void> {
    await this.supportRequestModel.findOneAndUpdate(
      { _id: supportRequestId },
      { isActive: false },
    );
  }
}
