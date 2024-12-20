import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IJwtPayload } from 'src/users/interfaces/jwt.payload';

import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)  

        if (!token)
            throw new UnauthorizedException()

        try {
            const payload: IJwtPayload = await this.jwtService.verifyAsync(
                token,
                { secret: process.env.JwtSecretKey }
            )
            request['user'] = payload

        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}