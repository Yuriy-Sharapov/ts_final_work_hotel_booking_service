import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
  Request,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { ISignupUserDto } from '../interfaces/signup.user.dto';
import { IUserAttr } from '../interfaces/user.attr';
import { Role } from 'src/types';
import { IParamUser } from '../interfaces/IParamUser';

@Controller('api/client')
export class UsersClientController {
  constructor(private readonly usersService: UsersService) {
    // Проверяем, какие пользователи проинициализированы
    //console.log(this.usersService.findAll());
  }

  // 2.3.3 Регистрация. Позволяет создать пользователя с ролью client в системе
  @HttpCode(HttpStatus.OK)
  @Post('/register')
  async signupClient(
    @Request() { user }: IParamUser,
    @Body() body: ISignupUserDto,
  ): Promise<IUserAttr> {
    if (user)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN, // 403
          error:
            'Прежде, чем зарегистровать нового пользователя, нажмите Выход для текущего',
        },
        HttpStatus.FORBIDDEN,
        {
          cause:
            'Прежде, чем зарегистровать нового пользователя, нажмите Выход для текущего',
        },
      );

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

    const newUser = body;
    newUser.role = Role.client;

    return this.usersService.create(newUser);
  }
}
