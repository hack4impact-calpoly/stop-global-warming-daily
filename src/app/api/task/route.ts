export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import TaskModel from "@/database/taskSchema";
import connectDB from "@/database/db";

export async function GET() {
  try {
    await connectDB();

    const tasks = await TaskModel.find().sort({ _id: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/task error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, time } = body;

    if (!title || !description || time === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTask = await TaskModel.create({
      title,
      description,
      time,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
