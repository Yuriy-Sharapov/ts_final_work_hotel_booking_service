import { ID, Role } from 'src/types';

export interface IUserAttr {
  id          ?: ID;
  email        : string;
  name         : string;
  contactPhone : string;
  role         : Role;
}
