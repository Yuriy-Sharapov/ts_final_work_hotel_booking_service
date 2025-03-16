import {
  Controller,
  UseGuards,
  SetMetadata,
  Get,
  Query,
  Post,
  Param,
} from '@nestjs/common';
import { IParamId, Role } from 'src/types';
import { AuthGuard } from 'src/auth/auth.guard';
import { ISearchSupportRequestParams } from '../interfaces/search.support.request.params';
import { SupportRequestsService } from '../services/support.requests.service';
import { ISupportRequestManagerAnswer } from '../interfaces/support.request.manager.answer';
import { SupportRequestsEmployeeService } from '../services/support.requests.employee.service';
import { UsersService } from 'src/users/users.service';

@Controller('/api/manager/support-requests/')
@SetMetadata('roles', [Role.manager]) // Запускать методы текущего класса может только Manager
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
export class SupportRequestManagerController {
  constructor(
    private readonly supportRequestsEmployeeService: SupportRequestsEmployeeService,
    private readonly supportRequestsService: SupportRequestsService,
    private readonly usersService: UsersService,
  ) {}

  // 2.5.3 Позволяет пользователю с ролью manager получить список обращений от клиентов

  @Get()
  async getSupportRequests(
    @Query() params: ISearchSupportRequestParams,
  ): Promise<ISupportRequestManagerAnswer[]> {
    // Получаем список запросов к поддержке
    const supportRequests =
      await this.supportRequestsService.findSupportRequests(params);

    // Создаем ответ для фронденда
    let supportRequestManagerAnswers: ISupportRequestManagerAnswer[];

    // Пробегаем по списку запросов к поддержке и заполняем соответствующие ответы пользователю
    for (let i = 0; i < supportRequests.length; i++) {
      const supportRequest = supportRequests[i];
      let supportRequestManagerAnswer: ISupportRequestManagerAnswer;
      supportRequestManagerAnswer.id = supportRequest.id;
      supportRequestManagerAnswer.createdAt = supportRequest.createdAt;
      supportRequestManagerAnswer.isActive = supportRequest.isActive;

      // Определяем, есть ли непрочитанные сообщений
      if (
        (await this.supportRequestsEmployeeService.getUnreadCount(
          supportRequest.id,
        )) > 0
      ) {
        supportRequestManagerAnswer.hasNewMessages = true;
      } else {
        supportRequestManagerAnswer.hasNewMessages = false;
      }

      // Заполняем информацию о пользователе, который открыл обращение в поддержку
      const user = await this.usersService.findByEmail(
        supportRequest.user.email,
      );
      supportRequestManagerAnswer.client = { ...user };

      supportRequestManagerAnswers.push(supportRequestManagerAnswer);
    }

    return supportRequestManagerAnswers;
  }

  // Закрывает обращение в поддержку

  @Post('/:id/closeRequest')
  async closeRequest(@Param() { id }: IParamId): Promise<void> {
    return this.supportRequestsEmployeeService.closeRequest(id);
  }
}
