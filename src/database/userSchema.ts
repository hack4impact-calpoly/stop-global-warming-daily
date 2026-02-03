import mongoose, { Schema, Types } from "mongoose";

export enum Role {
  user = "user",
  admin = "admin",
}

export interface IUsers {
  _id: Types.ObjectId;
  email: string;
  name: string;
  role: Role;
}

const UserSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      default: Role.user,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUsers>("User", UserSchema, "devusers");
