import mongoose, { Schema, Types } from "mongoose";

export type IChallenges = {
  _id: Types.ObjectId;
  title: string;
  color: string;
  task_ids: Types.ObjectId[];
  users: Types.ObjectId[];
  isActive: boolean;
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
  },
  {
    collection: "devchallenges",
  },
);

const ChallengeModel = mongoose.models.Challenge || mongoose.model<IChallenges>("Challenge", challengeSchema);

export default ChallengeModel;
