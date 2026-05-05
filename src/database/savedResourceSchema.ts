import mongoose, { Schema, Types } from "mongoose";

export type ISavedResources = {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  resource_ids: Types.ObjectId[];
};

const savedResourceSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    resource_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "DevResource",
        default: [],
      },
    ],
  },
  {
    collection: "devsavedresources",
    timestamps: true,
  },
);

const SavedResourceModel =
  mongoose.models.SavedResource || mongoose.model<ISavedResources>("SavedResource", savedResourceSchema);

export default SavedResourceModel;
