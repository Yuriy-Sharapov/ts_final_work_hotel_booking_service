import { ObjectId } from 'mongoose';

export type ID = ObjectId;

export enum Role {
  client,
  admin,
  manager,
}

export interface IParamId {
  id: ID;
}
