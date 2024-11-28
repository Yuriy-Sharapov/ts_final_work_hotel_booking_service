import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import * as dotenv from 'dotenv'
dotenv.config()

@Module({
    imports: [
        forwardRef(() => UsersModule),  // разрешаем циклическую зависимость UsersModule -> AuthModule
        PassportModule,
        JwtModule.register({
            global     : true,          // делаем JwtModule глобальным для разрешения зависимости с AuthGuard
            secret     : process.env.JwtSecretKey,
            signOptions: { expiresIn: '1h' }
        })
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
