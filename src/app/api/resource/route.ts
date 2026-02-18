export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import ResourceModel from "@/database/resourceSchema";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, picture, location, link } = body;

    if (!title || !description || !picture || !location || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newResource = await ResourceModel.create({
      title,
      description,
      picture,
      location,
      link,
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error("POST /api/resource error:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
