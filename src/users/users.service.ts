import { Injectable } from '@nestjs/common';
import { IUserDto } from './interfaces/user';
import { identity } from 'rxjs';
import { ISignupUserDto } from './interfaces/signup.user.dto';

@Injectable()
export class UsersService {
   
    private readonly users: IUserDto[] = [
        {
            id       : 1,
            email    : "user@mail.ru",
            password : "1",
            firstName: "John",
            lastName : "Johnson"
        },
        {
            id       : 2,
            email    : "jill@mail.ru",
            password : "2",
            firstName: "Jill",
            lastName : "Jillson"
        }        
    ];

    findAll(): IUserDto[] {
        return this.users
    }

    async findOne(email: string): Promise<IUserDto | undefined> {
        return this.users.find( user => user.email === email)
    }

    async findOneById(userId: number): Promise<IUserDto | undefined> {
        return this.users.find( user => user.id == userId)
    }

    async create(signupUserDto: ISignupUserDto): Promise<IUserDto> {
        
        const newUserId = this._getMaxId() + 1
        const dbUser: IUserDto = {
            id: newUserId,
            ...signupUserDto
        }
        this.users.push(dbUser)
        return dbUser
    }
    
    private _getMaxId(): number {        
        if(this.users.length === 0)
            return 0

        return Number(Math.max(...this.users.map(user => user.id)))
    }    
}