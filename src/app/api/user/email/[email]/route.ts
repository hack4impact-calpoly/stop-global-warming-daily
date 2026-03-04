import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/database/db";
import User from "@/database/userSchema";

// get a user by email
export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
  try {
    await connectDB();

    const email = decodeURIComponent(params.email).toLowerCase();
    const user = await User.findOne({ email });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
}
