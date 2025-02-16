import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from './users.schema';
import { ISignupUserDto } from './interfaces/signup.user.dto';
import { ISigninUserDto } from './interfaces/signin.user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    // Проверяем, какие пользователи проинициализированы
    //console.log(this.usersService.findAll());
  }

  // Регистрация пользователя
  @Post('/signup')
  async signup(@Body() body: ISignupUserDto): Promise<User> {
    try {
      const existUser = await this.usersService.findByEmail(body.email);
      console.log(`Пользователь ${existUser.email} уже зарегистрирован`);
      return null;
    } catch {
      // такого пользователя нет. Идем дальше
    }

    return this.usersService.create(body);
  }

  // Аутентификация пользвоателя
  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(@Body() body: ISigninUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  // Профиль пользователя под защитой JWT-токена
  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
