import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, name, role } = body;

    if (!email || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newUser = await User.create({
      email,
      name,
      role: role ?? "user",
      streak: 0,
      completedDates: [],
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/user error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
