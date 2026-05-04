export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/database/db";
import SavedResourceModel from "@/database/savedResourceSchema";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { user_id, resource_ids = [] } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(user_id)) {
      return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
    }

    if (!Array.isArray(resource_ids)) {
      return NextResponse.json({ error: "resource_ids must be an array" }, { status: 400 });
    }

    const existingSavedResources = await SavedResourceModel.findOne({ user_id });

    if (existingSavedResources) {
      return NextResponse.json({ error: "Saved resources already exist for this user" }, { status: 409 });
    }

    const newSavedResources = await SavedResourceModel.create({
      user_id,
      resource_ids,
    });

    return NextResponse.json(newSavedResources, { status: 201 });
  } catch (error) {
    console.error("POST /api/savedResource error:", error);
    return NextResponse.json({ error: "Failed to create saved resources" }, { status: 500 });
  }
}
