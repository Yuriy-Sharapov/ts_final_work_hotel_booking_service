import { Injectable } from '@nestjs/common';
import { ID, Role } from 'src/types';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from '../schemas/support.request.schema';
import { ISupportRequestEmployeeService } from '../interfaces/support.request.employee.service';
import { IMarkMessagesAsReadDto } from '../interfaces/mark.messages.as.read.dto';
import { IMarkMessagesAsReadAnswer } from '../interfaces/mark.messages.as.read.answer';

@Injectable()
export class SupportRequestsEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async markMessagesAsRead(params: IMarkMessagesAsReadDto): Promise<IMarkMessagesAsReadAnswer> {
    //u

    // должен выставлять текущую дату в поле readAt всем сообщениям,
    // которые не были прочитаны и были отправлены пользователем
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

      return { "success": true }

    } catch (e) {
      console.log(e);
      return { "success": false }
    }
  }

  async getUnreadCount(supportRequestId: ID): Promise<number> {
    //u
    // должен возвращать количество сообщений,
    // которые были отправлены пользователем и не отмечены прочитанными.
    return this.supportRequestModel.findById(supportRequestId).countDocuments({
      'messages.readAt': null,
      'messages.author.role': Role.client, // отправлены пользователем
    });
  }
  async closeRequest(supportRequestId: ID): Promise<void> {
    // должен менять флаг isActive на false
    await this.supportRequestModel.findOneAndUpdate(
      { _id: supportRequestId },
      { isActive: false },
    );
  }
}
