import { Body, Controller, Get, Param, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { IUserDto } from './interfaces/user';
import { ISignupUserDto } from './interfaces/signup.user.dto';
import { ISigninUserDto } from './interfaces/signin.user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/users')
export class UsersController {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {
        // Проверяем, какие пользователи проинициализированы
        console.log(this.usersService.findAll())        
    }

    // Регистрация пользователя
    @Post('/signup')
    async signup(@Body() body: ISignupUserDto): Promise<IUserDto> {

        try {
            const existUser = await this.usersService.findOne(body.email)
            console.log(`Пользователь ${existUser.email} уже зарегистрирован`)
            return null
        }
        catch(e) { 
            // такого пользователя нет. Идем дальше
        }

        return this.usersService.create(body)
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
