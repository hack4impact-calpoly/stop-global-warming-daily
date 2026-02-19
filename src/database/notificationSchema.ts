import mongoose, { Schema } from "mongoose";

export type INotification = {
  _id: string;
  description: string;
  userId: string;
  time: Date;
};

const notificationSchema = new Schema(
  {
    description: { type: String, required: true },
    userId: { type: String, required: true },
    time: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "notifications",
  },
);

const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);

export default NotificationModel;
