import mongoose, { Schema, Types } from "mongoose";

export type ITaskAssignment = {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  task_id: Types.ObjectId;
  challenge_id?: Types.ObjectId;
  date?: Date;
  isComplete: boolean;
};

const taskAssignmentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task_id: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    challenge_id: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
    },
    date: {
      type: Date,
    },
    isComplete: {
      type: Boolean,
      required: true,
    },
  },
  {
    collection: "devtaskassignments",
  },
);

taskAssignmentSchema.index(
  { challenge_id: 1, user_id: 1, task_id: 1 },
  {
    unique: true,
    partialFilterExpression: {
      challenge_id: { $exists: true },
    },
  },
);

const TaskAssignment =
  mongoose.models.TaskAssignment || mongoose.model<ITaskAssignment>("TaskAssignment", taskAssignmentSchema);

export default TaskAssignment;
