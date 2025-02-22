import { ObjectId } from "mongoose";

export enum UserRole {
  Manager = "manager",
  Worker = "worker",
}

export default interface IUser {
  _id: ObjectId;
  googleid?: string;
  githubid?: string;
  username: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  password?: string;
}
