import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import TaskAssignment from "@/database/taskAssignmentSchema";
import User from "@/database/userSchema";

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const getDateWindow = (baseDate: Date, range: string) => {
  if (range === "week") {
    const startDate = getWeekStart(baseDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);
    return { startDate, endDate };
  }

  const startDate = new Date(baseDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);
  return { startDate, endDate };
};

// get user's assignment by date, default is "today"
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const range = searchParams.get("range") ?? "day";
    const baseDate = dateParam ? new Date(dateParam) : new Date();
    if (Number.isNaN(baseDate.getTime())) {
      return NextResponse.json({ error: "Invalid date parameter" }, { status: 400 });
    }
    const { startDate, endDate } = getDateWindow(baseDate, range);

    const taskAssignment = await TaskAssignment.find({
      user_id: params.userId,
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: 1 });

    return NextResponse.json(taskAssignment, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch task assignment" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const { assignmentId, ...updates } = body;

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const filter = assignmentId
      ? {
          _id: assignmentId,
          user_id: params.userId,
        }
      : (() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          return {
            user_id: params.userId,
            date: { $gte: today, $lt: tomorrow },
          };
        })();

    const updated = await TaskAssignment.findOneAndUpdate(filter, { $set: updates }, { new: true });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (updated.isComplete === true) {
      const user = await User.findById(params.userId);

      if (user) {
        const todayStr = today.toDateString();

        const alreadyCompleted = user.completedDates.some((d: Date) => new Date(d).toDateString() === todayStr);

        if (!alreadyCompleted) {
          user.completedDates.push(today);
          user.streak += 1;
          await user.save();
        }
      }
    }

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
