import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IJwtPayload } from 'src/users/interfaces/jwt.payload';
import * as dotenv from 'dotenv'
dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey   : process.env.JwtSecretKey // 'jwt_secret_key'
        })
    }

    public async validate(payload: IJwtPayload) {
        const user = await this.authService.validateUserByJwt(Number(payload.id))
        if (!user)
            throw new UnauthorizedException()
        
        return user
    }
}