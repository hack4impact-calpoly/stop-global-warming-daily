import mongoose, { Schema } from "mongoose";

export type ITasks = {
  _id: string;
  title: string;
  description: string;
  points: number;
};

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    points: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    collection: "devtasks",
  },
);

const TaskModel = mongoose.models.Task || mongoose.model<ITasks>("Task", taskSchema);

export default TaskModel;
