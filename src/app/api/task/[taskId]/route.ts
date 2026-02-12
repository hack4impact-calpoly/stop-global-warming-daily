export const dynamic = "force-dynamic"; // making sure we arent using cashed data

import { NextResponse } from "next/server";
import TaskModel from "@/database/taskSchema";
import connectDB from "@/database/db";

export async function GET(_req: Request, { params }: { params: { taskId: string } }) {
  try {
    await connectDB();

    const task = await TaskModel.findById(params.taskId);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET /api/task/:taskId error:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { taskId: string } }) {
  try {
    await connectDB();

    const updates = await req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      params.taskId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH /api/task/:taskId error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { taskId: string } }) {
  try {
    await connectDB();

    const deletedTask = await TaskModel.findByIdAndDelete(params.taskId);

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/task/:taskId error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
