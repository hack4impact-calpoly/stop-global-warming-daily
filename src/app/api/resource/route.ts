export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import ResourceModel from "@/database/resourceSchema";

export async function GET() {
  try {
    await connectDB();

    const resources = await ResourceModel.find().sort({ createdAt: -1, _id: -1 });

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("GET /api/resource error:", error);
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, location, link, tags = [] } = body;

    if (!title || !description || !location || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
    }

    const newResource = await ResourceModel.create({
      title,
      description,
      location,
      link,
      tags,
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error("POST /api/resource error:", error);
    return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
  }
}
