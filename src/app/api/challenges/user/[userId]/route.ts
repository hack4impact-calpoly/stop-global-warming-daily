import { NextResponse } from "next/server";
import ChallengeModel from "@/database/challengeSchema";
import connectDB from "@/database/db";
import { Types } from "mongoose";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId } = params;

    const challenges = await ChallengeModel.find({
      users: new Types.ObjectId(userId),
    });

    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error("GET /api/challenges/user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
