import mongoose, { Schema } from "mongoose";

export enum Tag {
  SustainableFood = "Sustainable Food",
  Transportation = "Transportation",
  Shopping = "Shopping",
  Community = "Community/Volunteering",
  WasteReduction = "Waste Reduction",
  EnergySaving = "Energy Saving",
  Nature = "Nature Preservation & Restoration",
}

export type ITasks = {
  _id: string;
  title: string;
  description: string;
  time: number;
  tags: string[];
};

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    time: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Time must be a whole number of minutes",
      },
    },
    tags: { type: [String], enum: Object.values(Tag), default: [] },
  },
  {
    collection: "devtasks",
  },
);

const TaskModel = mongoose.models.Task || mongoose.model<ITasks>("Task", taskSchema);

export default TaskModel;
