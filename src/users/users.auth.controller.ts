import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ISigninUserDto } from './interfaces/signin.user.dto';

@Controller('api/auth')
export class UsersAuthController {
  constructor(private readonly authService: AuthService) {
    // Проверяем, какие пользователи проинициализированы
    //console.log(this.usersService.findAll());
  }

  // 2.3.1. Вход. Стартует сессию пользователя и выставляет Cookies
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signin(@Body() body: ISigninUserDto) {
    return this.authService.signIn(body.email, body.password);
  }

  // 2.3.2. Выход. Завершает сессию пользователя и удаляет Cookies
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout() {
    return this.authService.logOut();
  }
}
