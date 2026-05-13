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
  streak: number;
  completedDates: Date[];
  notificationsAsked: boolean;
  notificationsEnabled: boolean;
  installationAsked: boolean;
  installed: boolean;
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

    streak: {
      type: Number,
      default: 0,
    },

    completedDates: {
      type: [Date],
      default: [],
    },

    notificationsAsked: {
      type: Boolean,
      required: true,
      default: false,
    },

    notificationsEnabled: {
      type: Boolean,
      required: true,
      default: false,
    },

    installationAsked: {
      type: Boolean,
      required: true,
      default: false,
    },

    installed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model<IUsers>("User", UserSchema, "devusers");
