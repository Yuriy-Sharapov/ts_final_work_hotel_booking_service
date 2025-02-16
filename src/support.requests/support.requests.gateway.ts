import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SupportRequestsService } from './support.requests.service';
import { ISendMessageDto } from 'src/support.requests/interfaces/send.message.dto';
import { ID } from 'src/types';

@WebSocketGateway({ cors: true }) // включаем политику кросдоменных запросов
export class SupportRequestsGateway {
  constructor(
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  // Добавляем новое сообщение и рассылаем всем подписчикам
  @SubscribeMessage('sendMessage')
  async onSendMessage(
    @MessageBody() body: ISendMessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<any> {
    const handshakeReferer = socket.handshake.headers.referer;
    const supportRequestId = handshakeReferer.split('/')[3] as ID;

    const sendMessageDto: ISendMessageDto = {
      authorId: body.authorId,
      supportRequestId: supportRequestId,
      text: body.text,
    };
    await this.supportRequestsService.sendMessage(sendMessageDto);

    // Рассылаем сообщение другим подписчикам
    socket.broadcast.emit('sendMessage', sendMessageDto);
  }
}
