import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Notification from "@/database/notificationSchema";

// GET
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const notifications = await Notification.find({
      userId: params.userId,
    }).sort({ time: -1 });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// PATCH
export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("notificationId");

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
    }

    const body = await req.json();

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: params.userId },
      body,
      { new: true },
    );

    if (!updatedNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("notificationId");

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
    }

    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: params.userId,
    });

    if (!deletedNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
