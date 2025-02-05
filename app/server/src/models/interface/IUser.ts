import { ObjectId } from "mongoose";
export default interface IUser {
  _id: ObjectId;
  googleid: string,
  githubid: string;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  password: string;
}
