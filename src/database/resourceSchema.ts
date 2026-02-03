import { Schema, model } from "mongoose";

export type IResources = {
  _id: string; //id only in type
  title: string;
  description: string;
  picture: string;
  location: string;
  link: string;
};

const resourceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    picture: { type: String, required: true },
    location: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    collection: "devresources",
  },
);

const ResourceModel = model<IResources>("DevResource", resourceSchema);

export default ResourceModel;
