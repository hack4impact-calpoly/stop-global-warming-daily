import { NextResponse } from "next/server";
import ChallengeModel from "@/database/challengeSchema";
import connectDB from "@/database/db";

export async function PATCH(req: Request, { params }: { params: { challengeId: string } }) {
  try {
    await connectDB();

    const { challengeId } = params;
    const body = await req.json();

    const updatedChallenge = await ChallengeModel.findByIdAndUpdate(challengeId, body, { new: true });

    if (!updatedChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

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

    return NextResponse.json({ message: "Challenge deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/challenges error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
