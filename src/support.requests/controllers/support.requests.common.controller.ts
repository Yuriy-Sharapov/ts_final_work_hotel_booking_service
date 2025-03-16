import {
  Controller,
  UseGuards,
  SetMetadata,
  Get,
  Request,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { IParamId, Role } from 'src/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { SupportRequestsService } from '../services/support.requests.service';
import { SupportRequestsEmployeeService } from '../services/support.requests.employee.service';
import { UsersService } from 'src/users/users.service';
import { ISupportRequestMessageAnswer } from '../interfaces/support.request.message.answer';
import { IParamUser } from 'src/users/interfaces/IParamUser';
import { Schema } from 'mongoose';
import { MessageDocument } from '../schemas/messages.schema';
import { ISendMessageDto } from '../interfaces/send.message.dto';
import { IParamMessageText } from '../interfaces/IParamMessageText';
import { SupportRequestsGuard } from '../support.requests.guard';
import { IParamMessageCreatedBefore } from '../interfaces/IParamMessageCreatedBefore';
import { SupportRequestsClientService } from '../services/support.requests.client.service';
import { IMarkMessagesAsReadDto } from '../interfaces/mark.messages.as.read.dto';
import { IMarkMessagesAsReadAnswer } from '../interfaces/mark.messages.as.read.answer';

@Controller('/api/common/support-requests')
@SetMetadata('roles', [Role.manager, Role.client]) // Запускать методы текущего класса может только Manager
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
@UseGuards(SupportRequestsGuard) // Проверяем, что пользователь соответствует роли и может работать с обращением в поддержку
export class SupportRequestCommonController {
  constructor(
    private readonly supportRequestsEmployeeService: SupportRequestsEmployeeService,
    private readonly supportRequestsClientService: SupportRequestsClientService,
    private readonly supportRequestsService: SupportRequestsService,
    private readonly usersService: UsersService,
  ) {}

  // 2.5.4 Позволяет пользователю с ролью manager или client получить все сообщения из чата

  @Get('/:id/messages')
  async getMessages(
    @Param() { id }: IParamId,
  ): Promise<ISupportRequestMessageAnswer[]> {
    // Получаем список сообщений для текущего обращения в поддержку
    const messages = await this.supportRequestsService.getMessages(id);

    let supportRequestMessageAnswers: ISupportRequestMessageAnswer[];

    // Пробегаем по списку запросов к поддержке и заполняем соответствующие ответы пользователю
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      let supportRequestMessageAnswer: ISupportRequestMessageAnswer;
      supportRequestMessageAnswer.id = message.id;
      supportRequestMessageAnswer.createdAt = message.sentAt;
      supportRequestMessageAnswer.text = message.text;
      supportRequestMessageAnswer.readAt = message.readAt;

      // Заполняем информацию об авторе
      supportRequestMessageAnswer.author = {
        id: new Schema.ObjectId(message.author._id.toString()),
        name: message.author.name,
      };

      supportRequestMessageAnswers.push(supportRequestMessageAnswer);
    }

    return supportRequestMessageAnswers;
  }

  // 2.5.5 Позволяет пользователю с ролью manager или client отправлять сообщения в чат

  @Post('/:id/messages')
  async sendMessage(
    @Request() { user }: IParamUser,
    @Param() { id }: IParamId,
    @Body() body: IParamMessageText,
  ): Promise<MessageDocument> {
    let sendMessageDto: ISendMessageDto;
    sendMessageDto.authorId = user.id;
    sendMessageDto.supportRequestId = id;
    sendMessageDto.text = body.text;

    return this.supportRequestsService.sendMessage(sendMessageDto);
  }

  // 2.5.6 Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны

  @Post('/:id/messages/read')
  async readMessages(
    @Request() { user }: IParamUser,
    @Param() { id }: IParamId,
    @Body() body: IParamMessageCreatedBefore,
  ): Promise<IMarkMessagesAsReadAnswer> {
    let markMessagesAsReadDto: IMarkMessagesAsReadDto;
    markMessagesAsReadDto.userId = user.id;
    markMessagesAsReadDto.supportRequestId = id;
    markMessagesAsReadDto.createdBefore = body.createdBefore;

    switch (user.role) {
      case Role.manager:
        return this.supportRequestsEmployeeService.markMessagesAsRead(
          markMessagesAsReadDto,
        );
      case Role.client:
        return this.supportRequestsClientService.markMessagesAsRead(
          markMessagesAsReadDto,
        );
    }
  }

  // 2.5.7 Подписка на сообщения из чата техподдержки

  // Класс для реализации веб-сокета на стороне бекенда SupportRequestsGateway
  // Подписывает на получение сообщений по веб-сокету код в файле index.html, который лежит в папке public
  // Подписка происходит в рамках ид Обращения в поддерку и начинается с момента, когда пользователь оказывается
  // на фронденте на странице обращения.
}
