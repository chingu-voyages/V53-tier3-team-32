import mongoose, { Model, Mongoose, Schema } from "mongoose";
import IUser from "../interface/IUser";
import DB from "../../lib/DB";

const UserSchema = new Schema<IUser>({
  googleid: {type: String},
  githubid: { type: String },
  email: { type: String, required: true},
  username: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const User: Model<IUser> = DB.model("User", UserSchema);
