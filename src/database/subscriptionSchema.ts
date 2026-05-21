import mongoose, { Schema, Types } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    userId: { type: String, required: true },
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema, "devsubscription");
