import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/types';
import { SupportRequestsService } from './services/support.requests.service';
import { IJwtPayload } from 'src/users/interfaces/jwt.payload';

// Защитник Обращения в поддержку
// Проверяет, чтобы сообщения могли писать только пользователи с ролями Менеджер или Клиент,
// а также, если роль клиент, то он может писать сообщения только в свое обращение в поддержку

@Injectable()
export class SupportRequestsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly supportRequestsService: SupportRequestsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Получаем JWT-токен
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    let payload: IJwtPayload;
    try {
      // Получаем полезную информацию из JWT-токена
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JwtSecretKey,
      });
    } catch {
      throw new UnauthorizedException();
    }

    // Проверяем соответствует ли роль авторизованного пользователя,
    // списку ролей, которые закреплены за методом контроллера

    // Получаем список ролей пользователя, которые закреплены за вызываемым методом контроллера
    const currentRouteRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Для метода контроллера, защищаемого этим защитником, обязательно должна быть прописана роль
    if (!currentRouteRoles) {
      throw new NotFoundException(); // HTTP 500
    }

    // Если список ролей метода НЕ содержит роль текущего пользователя, выдаем ошибку
    if (!currentRouteRoles.includes(request['user'].role)) {
      throw new ForbiddenException(
        'Список ролей метода НЕ содержит роль текущего пользователя',
      ); // HTTP 403
    }

    // Получаем параметры запуска метода контроллера
    const params = context.getArgs();
    const supportRequestId = params[0]; // Первый аргумент, переданный в контролируемый метод

    if (!supportRequestId)
      throw new BadRequestException('Не передано ID обращения в поддержку.');

    const supportRequest =
      await this.supportRequestsService.findById(supportRequestId);

    if (!supportRequest) {
      throw new BadRequestException(
        `Обращения в поддержку с указанным ID ${supportRequestId} не существует`,
      ); // HTTP 400
    }

    if (
      request['user'].role === Role.client &&
      supportRequest.user._id.toString() != payload.id
    ) {
      throw new BadRequestException(
        `Автором обращения в поддержку с ID ${supportRequest} является другой пользователь`,
      ); // HTTP 400
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
