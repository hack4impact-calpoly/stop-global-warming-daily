import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import TaskAssignment from "@/database/taskAssignmentSchema";

// get user's assignment by date, default is "today"
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    const startDate = dateParam ? new Date(dateParam) : new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const taskAssignment = await TaskAssignment.find({
      user_id: params.userId,
      date: { $gte: startDate, $lt: endDate },
    });

    return NextResponse.json(taskAssignment, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch task assignment" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const updated = await TaskAssignment.findOneAndUpdate(
      {
        user_id: params.userId,
        date: { $gte: today, $lt: tomorrow },
      },
      body,
      { new: true },
    );

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const deleted = await TaskAssignment.findOneAndDelete({
      user_id: params.userId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
