export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import connectDB from "@/database/db";
import ResourceModel from "@/database/resourceSchema";

export async function GET(_req: Request, { params }: { params: { resourceId: string } }) {
  try {
    await connectDB();

    const resource = await ResourceModel.findById(params.resourceId);

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error("GET /api/resource/:id error:", error);
    return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { resourceId: string } }) {
  try {
    await connectDB();

    const updates = await req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    if (updates.tags && !Array.isArray(updates.tags)) {
      return NextResponse.json({ error: "tags must be an array" }, { status: 400 });
    }

    const updatedResource = await ResourceModel.findByIdAndUpdate(
      params.resourceId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json(updatedResource);
  } catch (error) {
    console.error("PATCH /api/resource/:id error:", error);
    return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { resourceId: string } }) {
  try {
    await connectDB();

    const deletedResource = await ResourceModel.findByIdAndDelete(params.resourceId);

    if (!deletedResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/resource/:id error:", error);
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
