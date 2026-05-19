import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import ChallengeModel from "@/database/challengeSchema";
import connectDB from "@/database/db";
import { toUniqueObjectIdStrings, upsertChallengeTaskAssignments } from "@/lib/challengeTaskAssignments";

type ChallengeMembersAndTasks = {
  users?: unknown[];
  task_ids?: unknown[];
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const challengeId = typeof body.challengeId === "string" ? body.challengeId : "";

    if (!Types.ObjectId.isValid(challengeId)) {
      return NextResponse.json({ error: "Invalid challenge id" }, { status: 400 });
    }

    const challenge = (await ChallengeModel.findById(challengeId)
      .select("users task_ids")
      .lean()) as ChallengeMembersAndTasks | null;

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    const challengeUserIds = toUniqueObjectIdStrings(challenge.users ?? []);
    const challengeTaskIds = toUniqueObjectIdStrings(challenge.task_ids ?? []);
    const userIds = Array.isArray(body.userIds) ? toUniqueObjectIdStrings(body.userIds) : challengeUserIds;
    const taskIds = Array.isArray(body.taskIds) ? toUniqueObjectIdStrings(body.taskIds) : challengeTaskIds;

    const hasInvalidUserIds = userIds.some((userId) => !challengeUserIds.includes(userId));
    if (hasInvalidUserIds) {
      return NextResponse.json({ error: "One or more user ids are not part of the challenge" }, { status: 400 });
    }

    const hasInvalidTaskIds = taskIds.some((taskId) => !challengeTaskIds.includes(taskId));
    if (hasInvalidTaskIds) {
      return NextResponse.json({ error: "One or more task ids are not part of the challenge" }, { status: 400 });
    }

    const result = await upsertChallengeTaskAssignments({
      challengeId,
      userIds,
      taskIds,
    });

    return NextResponse.json(
      {
        challengeId,
        userIds,
        taskIds,
        ...result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/taskAssignment/challenge error:", error);
    return NextResponse.json({ error: "Failed to create challenge task assignments" }, { status: 500 });
  }
}
