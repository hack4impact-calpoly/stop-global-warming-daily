export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import TaskModel, { Tag } from "@/database/taskSchema";
import connectDB from "@/database/db";

const VALID_TAGS = new Set<string>(Object.values(Tag));

type CreateTaskBody = {
  title?: unknown;
  description?: unknown;
  time?: unknown;
  tags?: unknown;
};

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

    const body = (await req.json()) as CreateTaskBody;

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const hasTime = body.time !== undefined && body.time !== null && body.time !== "";
    const time = hasTime ? Number(body.time) : NaN;
    const requestedTags: unknown[] = Array.isArray(body.tags) ? body.tags : [];

    if (!title || !description || !hasTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Number.isInteger(time) || time <= 0) {
      return NextResponse.json({ error: "Time must be a whole number greater than 0." }, { status: 400 });
    }

    const tags = [...new Set(requestedTags.filter((tag): tag is string => typeof tag === "string"))];

    const hasInvalidTag = tags.some((tag: string) => !VALID_TAGS.has(tag));

    if (hasInvalidTag) {
      return NextResponse.json({ error: "One or more tags are invalid." }, { status: 400 });
    }

    const newTask = await TaskModel.create({
      title,
      description,
      time,
      tags,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST /api/task error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
