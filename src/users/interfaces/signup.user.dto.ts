// Регистрация

import { Role } from 'src/types';

export interface ISignupUserDto {
  email: string;
  password: string;
  name: string;
  contactPhone: string;
  role?: Role;
}
