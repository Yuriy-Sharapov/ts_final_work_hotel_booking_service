import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IJwtPayload } from 'src/users/interfaces/jwt.payload';

import * as dotenv from 'dotenv';
import { Reflector } from '@nestjs/core';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Проверяем аутентификацию пользователя
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JwtSecretKey,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    // 2. Проверяем соответствует ли роль авторизованного пользователя,
    // списку ролей, которые закреплены за методом контроллера

    // Получаем список ролей пользователя, которые закреплены за вызываемым методом контроллера
    const currentRouteRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!currentRouteRoles) {
      return true;
    }

    // Если список ролей метода НЕ содержит роль текущего пользователя, выдаем ошибку
    if (!currentRouteRoles.includes(request['user'].role)) {
      throw new ForbiddenException(); // HTTP 403
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
