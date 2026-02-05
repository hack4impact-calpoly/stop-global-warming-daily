import mongoose, { Schema } from "mongoose";

export type ITaskAssignment = {
  _id?: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  task_id: Schema.Types.ObjectId;
  date: Date;
};

const taskAssignmentSchema = new Schema<ITaskAssignment>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    task_id: {
      type: Schema.Types.ObjectId,
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
