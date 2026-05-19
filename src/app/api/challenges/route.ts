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

    const challenge = await req.json();

    const newChallenge = await ChallengeModel.create(challenge);

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
