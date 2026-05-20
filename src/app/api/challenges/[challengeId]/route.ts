import { NextResponse } from "next/server";
import TaskAssignment from "@/database/taskAssignmentSchema";
import ChallengeModel from "@/database/challengeSchema";
import connectDB from "@/database/db";
import { syncChallengeTaskAssignments, toUniqueObjectIdStrings } from "@/lib/challengeTaskAssignments";

export async function PATCH(req: Request, { params }: { params: { challengeId: string } }) {
  try {
    await connectDB();

    const { challengeId } = params;
    const body = await req.json();

    const updatedChallenge = await ChallengeModel.findByIdAndUpdate(challengeId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    await syncChallengeTaskAssignments({
      challengeId,
      userIds: toUniqueObjectIdStrings(updatedChallenge.users ?? []),
      taskIds: toUniqueObjectIdStrings(updatedChallenge.task_ids ?? []),
    });

    return NextResponse.json(updatedChallenge, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/challenges error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { challengeId: string } }) {
  try {
    await connectDB();

    const { challengeId } = params;

    const deleted = await ChallengeModel.findByIdAndDelete(challengeId);

    if (!deleted) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    await TaskAssignment.deleteMany({ challenge_id: challengeId });

    return NextResponse.json({ message: "Challenge deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/challenges error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { challengeId: string } }) {
  try {
    await connectDB();

    const challenge = await ChallengeModel.findById(params.challengeId);

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    return NextResponse.json(challenge, { status: 200 });
  } catch (error) {
    console.error("GET /api/challenges/[challengeId] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
