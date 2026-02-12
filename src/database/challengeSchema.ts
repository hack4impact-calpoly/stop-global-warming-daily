import mongoose, { Schema, Types } from "mongoose";

export type IChallenges = {
  _id: Types.ObjectId;
  title: string;
  task_ids: Types.ObjectId[];
  users: Types.ObjectId[];
};

const challengeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
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
  },
  {
    collection: "devchallenges",
  },
);

const ChallengeModel =
  mongoose.models.Challenge || mongoose.model<IChallenges>("Challenge", challengeSchema);

export default ChallengeModel;
