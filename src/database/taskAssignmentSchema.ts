import mongoose, { Schema, Types } from "mongoose";

export type ITaskAssignment = {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  task_id: Types.ObjectId;
  date: Date;
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
    date: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "devtaskassignments",
  },
);

const TaskAssignment =
  mongoose.models.TaskAssignment || mongoose.model<ITaskAssignment>("TaskAssignment", taskAssignmentSchema);

export default TaskAssignment;
