import mongoose, { Schema, Types } from "mongoose";

export enum Role {
  user = "user",
  admin = "admin",
}

export enum Tag {
  SustainableFood = "Sustainable Food",
  Transportation = "Transportation",
  Shopping = "Shopping",
  Community = "Community/Volunteering",
  WasteReduction = "Waste Reduction",
  EnergySaving = "Energy Saving",
  Nature = "Nature Preservation & Restoration",
}

export interface IUsers {
  _id: Types.ObjectId;
  email: string;
  name: string;
  role: Role;
  streak: number;
  completedDates: Date[];
  birthday?: Date;
  locationName?: string;
  locationCoordinates: number[];
  interests: string[];
  focuses: string[];
  picture: string;
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

    birthday: {
      type: Date,
    },

    locationName: {
      type: String,
      trim: true,
      default: "",
    },

    locationCoordinates: {
      type: [Number],
      default: [],
      validate: {
        validator: function (value: number[]) {
          return value.length === 0 || value.length === 2;
        },
        message: "locationCoordinates must contain exactly 2 numbers",
      },
    },

    interests: {
      type: [String],
      enum: Object.values(Tag),
      default: [],
    },

    focuses: {
      type: [String],
      default: [],
    },

    picture: {
      type: String,
      trim: true,
      default: "",
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
