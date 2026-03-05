import { NextResponse } from "next/server";
import ChallengeModel from "@/database/challengeSchema";
import connectDB from "@/database/db";

export async function POST(req: Request) {
  await connectDB();

  const challenge = await req.json();

  const newChallenge = await ChallengeModel.create(challenge);

  return NextResponse.json(newChallenge, { status: 201 });
}
