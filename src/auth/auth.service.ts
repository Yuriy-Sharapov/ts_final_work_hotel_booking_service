import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from 'src/users/interfaces/jwt.payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUserByJwt(userId: number): Promise<any>{

        const user = await this.usersService.findOneById(userId)
        if ( user )
            return user
        
        return null
    }

    // При успешной авторизации пользователя запрашиваем JWT-токен и возвращаем его не фронтенд
    async signIn(email: string, pass: string): Promise<{ access_token: string }> {

        const user = await this.usersService.findOne(email)
        if (user?.password !== pass) {      // <---- в последствии пароль будет зашифрован через bcrypt
            throw new UnauthorizedException();
        }

        const payload: IJwtPayload = {
            id       : user.id.toString(), 
            email    : user.email,     
            firstName: user.firstName  
        }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}