import mongoose, { Schema } from "mongoose";

export type INotification = {
  _id: string;
  header: string;
  description: string;
  isRead: boolean;
  userId: string;
  time: Date;
};

const notificationSchema = new Schema(
  {
    description: { type: String, required: true },
    header: { type: String, required: true },
    userId: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    time: { type: Date, default: Date.now },
  },
  {
    collection: "notifications",
  },
);

const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);

export default NotificationModel;
