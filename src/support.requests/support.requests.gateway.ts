import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SupportRequestsService } from './services/support.requests.service';
import { ISendMessageDto } from 'src/support.requests/interfaces/send.message.dto';
import { Schema } from 'mongoose';

@WebSocketGateway({ cors: true }) // включаем политику кросдоменных запросов
export class SupportRequestsGateway {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  // Получаем все сообщения для конкретного Обращения в поддержку
  @SubscribeMessage('getAllMessages')
  async onGetAllMessages(@ConnectedSocket() socket: Socket): Promise<any> {
    const handshakeReferer = socket.handshake.headers.referer
    // Получаем ид Обращения в поддержку 
    const supportRequestId = new Schema.ObjectId(handshakeReferer.split('/')[3]);

    const messages = await this.supportRequestsService.getMessages(supportRequestId)
    return messages;
  }

  // Добавляем новое сообщение и рассылаем всем подписчикам
  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @MessageBody() body: ISendMessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    const handshakeReferer = socket.handshake.headers.referer;
    // Получаем ид Обращения в поддержку 
    const supportRequestId = new Schema.ObjectId(handshakeReferer.split('/')[3]);

    const sendMessageDto: ISendMessageDto = {
      authorId        : body.authorId,
      supportRequestId: supportRequestId,
      text            : body.text,
    };
    await this.supportRequestsService.sendMessage(sendMessageDto);

    // Рассылаем сообщение другим подписчикам
    socket.broadcast.emit('sendMessage', sendMessageDto);
  }
}
