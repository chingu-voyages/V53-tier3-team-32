import mongoose, { Model, Schema } from "mongoose";
import IUser, { UserRole } from "../interface/IUser";
import DB from "../../lib/DB";

const UserSchema = new Schema<IUser>({
  googleid: { type: String },
  githubid: { type: String },
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: {
    type: String,
    enum: [UserRole.Manager, UserRole.Worker],
    default: UserRole.Worker,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const User: Model<IUser> = DB.model<IUser>("User", UserSchema);