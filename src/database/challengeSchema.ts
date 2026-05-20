import mongoose, { Schema, Types } from "mongoose";

export enum Tag {
  SustainableFood = "Sustainable Food",
  Transportation = "Transportation",
  Shopping = "Shopping",
  Community = "Community/Volunteering",
  WasteReduction = "Waste Reduction",
  EnergySaving = "Energy Saving",
  Nature = "Nature Preservation & Restoration",
}

export type IChallenges = {
  _id: Types.ObjectId;
  title: string;
  color: string;
  task_ids: Types.ObjectId[];
  users: Types.ObjectId[];
  isActive: boolean;
  description: string;
  tags: string[];
  time: number;
};

const challengeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },

    color: {
      type: String,
      required: true,
      default: "#3B82F6",
    },

    task_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
        required: true,
      },
    ],

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: Number,
      defualt: 30,
    },

    tags: {
      type: [String],
      enum: Object.values(Tag),
      default: [],
    },
  },
  {
    collection: "devchallenges",
  },
);

const ChallengeModel = mongoose.models.Challenge || mongoose.model<IChallenges>("Challenge", challengeSchema);

export default ChallengeModel;
