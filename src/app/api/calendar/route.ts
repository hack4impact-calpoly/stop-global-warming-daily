export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import TaskAssignment from "@/database/taskAssignmentSchema";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    if (!userId || !monthParam || !yearParam) {
      return NextResponse.json({ error: "userId, month, and year are required" }, { status: 400 });
    }

    const month = Number(monthParam); // 1-12
    const year = Number(yearParam);

    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(year)) {
      return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const taskAssignments = await TaskAssignment.find({
      user_id: userId,
      challenge_id: { $exists: false },
      date: { $gte: startDate, $lt: endDate },
    })
      .select("_id task_id date isComplete")
      .sort({ date: 1 })
      .lean();

    return NextResponse.json(taskAssignments, { status: 200 });
  } catch (error) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }
}
