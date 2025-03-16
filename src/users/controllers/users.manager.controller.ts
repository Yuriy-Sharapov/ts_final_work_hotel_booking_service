import { Controller, Get, UseGuards, Query, SetMetadata } from '@nestjs/common';
import { UsersService } from '../users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserAttr } from '../interfaces/user.attr';
import { Role } from 'src/types';
import { ISearchUserParams } from '../interfaces/search.user.params';

@Controller('api/manager/users')
@SetMetadata('roles', [Role.manager]) // Запускать методы текущего класса может только Manager
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
export class UsersManagerController {
  constructor(private readonly usersService: UsersService) {
    // Проверяем, какие пользователи проинициализированы
    //console.log(this.usersService.findAll());
  }

  // 2.4.2. Получение списка пользователей (менеджером)
  @Get()
  async search(@Query() params: ISearchUserParams): Promise<IUserAttr[]> {
    return this.usersService.findAll(params);
  }
}
