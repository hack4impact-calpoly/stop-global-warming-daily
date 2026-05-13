import mongoose, { Schema } from "mongoose";
import { Tag } from "@/database/userSchema";

export type IResources = {
  _id: string;
  title: string;
  description: string;
  location: string;
  link: string;
  tags: string[];
};

const resourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      enum: Object.values(Tag),
      default: [],
    },
  },
  {
    collection: "devresources",
    timestamps: true,
  },
);

const ResourceModel = mongoose.models.DevResource || mongoose.model<IResources>("DevResource", resourceSchema);

export default ResourceModel;
