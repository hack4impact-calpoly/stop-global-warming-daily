import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import TaskAssignment from "@/database/taskAssignmentSchema";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { user_id, task_id, date, isComplete = false } = body;

    if (!user_id || !task_id || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTaskAssignment = await TaskAssignment.create({
      user_id,
      task_id,
      date,
      isComplete,
    });

    return NextResponse.json(newTaskAssignment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task assignment" }, { status: 500 });
  }
}
