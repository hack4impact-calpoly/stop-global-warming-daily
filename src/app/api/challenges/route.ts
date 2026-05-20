export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import ChallengeModel from "@/database/challengeSchema";
import connectDB from "@/database/db";
import { syncChallengeTaskAssignments, toUniqueObjectIdStrings } from "@/lib/challengeTaskAssignments";

export async function GET() {
  try {
    await connectDB();

    const challenges = await ChallengeModel.find().sort({ _id: -1 });

    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error("GET /api/challenges error:", error);
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const newChallenge = await ChallengeModel.create({
      title: body.title.trim(),
      description: body.description.trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      time: Number(body.time ?? 0),
      task_ids: Array.isArray(body.task_ids) ? body.task_ids : [],
      users: Array.isArray(body.users) ? body.users : [],
      isActive: Boolean(body.isActive),
    });

    await syncChallengeTaskAssignments({
      challengeId: newChallenge._id.toString(),
      userIds: toUniqueObjectIdStrings(newChallenge.users ?? []),
      taskIds: toUniqueObjectIdStrings(newChallenge.task_ids ?? []),
    });

    return NextResponse.json(newChallenge, { status: 201 });
  } catch (error) {
    console.error("POST /api/challenges error:", error);
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }
}
