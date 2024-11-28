import { ObjectId } from "mongoose"

export type ID = string | ObjectId

export enum Role { client, admin, manager }