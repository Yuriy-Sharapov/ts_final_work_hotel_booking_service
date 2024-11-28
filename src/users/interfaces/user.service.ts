import { ID } from "src/types";
import { IUser } from "./user";
import { ISearchUserParams } from "./search.user.params";

export interface IUserService {
    create(data: Partial<IUser>): Promise<IUser>;
    findById(id: ID): Promise<IUser>;
    findByEmail(email: string): Promise<IUser>;
    findAll(params: ISearchUserParams): Promise<IUser[]>;
}