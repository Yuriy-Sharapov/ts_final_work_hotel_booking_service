import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ID } from 'src/types';
import { IJwtPayload } from 'src/users/interfaces/jwt.payload';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByJwt(userId: ID): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (user) return user;
    else return null;
  }

  // При успешной авторизации пользователя запрашиваем JWT-токен и возвращаем его не фронтенд
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    const success = await bcrypt.compare(pass, user?.passwordHash);

    if (!success) throw new UnauthorizedException();

    // if (user?.password !== pass) {      // <---- в последствии пароль будет зашифрован через bcrypt
    //   throw new UnauthorizedException();
    // }

    const payload: IJwtPayload = {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      contactPhone: user.contactPhone,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async logOut(): Promise<{ access_token: string }> {
    // Для разлогинивания необходимо удалить jwt-токен и вернуть его на фронт
    // Далее запросы от фронтенда будут считаться невалидными, т.е. пользователь выполнил выход
    return {
      access_token: '',
    };
  }
}
