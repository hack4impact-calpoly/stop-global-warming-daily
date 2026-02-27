import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import Notification from "@/database/notificationSchema";

// POST
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, description } = body;

    if (!userId || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newNotification = await Notification.create({
      userId,
      description,
      isRead: false,
    });

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
