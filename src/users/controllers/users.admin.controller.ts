import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  HttpStatus,
  HttpException,
  Query,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { ISignupUserDto } from '../interfaces/signup.user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUserAttr } from '../interfaces/user.attr';
import { Role } from 'src/types';
import { ISearchUserParams } from '../interfaces/search.user.params';

@Controller('api/admin/users')
@SetMetadata('roles', [Role.admin]) // Запускать методы текущего класса может только Admin
@UseGuards(AuthGuard) // Профиль пользователя под защитой JWT-токена
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {
    // Проверяем, какие пользователи проинициализированы
    //console.log(this.usersService.findAll());
  }

  // 2.4.1 Позволяет пользователю с ролью admin создать пользователя в системе

  @Post()
  async signup(@Body() body: ISignupUserDto): Promise<IUserAttr> {
    try {
      const existUser = await this.usersService.findByEmail(body.email);
      if (existUser)
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST, // 400
            error: `Пользователь ${existUser.email} уже зарегистрирован`,
          },
          HttpStatus.UNAUTHORIZED,
          {
            cause: `Пользователь ${existUser.email} уже зарегистрирован`,
          },
        );
    } catch {
      // Такой пользователь еще не зарегистрировался. Значит все хорошо. Идем дальше
    }

    return this.usersService.create(body);
  }

  // 2.4.2. Получение списка пользователей (администратором)
  @Get()
  async search(@Query() params: ISearchUserParams): Promise<IUserAttr[]> {
    return this.usersService.findAll(params);
  }
}
