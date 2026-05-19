export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/database/db";
import SavedResourceModel from "@/database/savedResourceSchema";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const savedResources = await SavedResourceModel.findOne({ user_id: userId });

    if (!savedResources) {
      return NextResponse.json({ error: "Saved resources not found" }, { status: 404 });
    }

    return NextResponse.json(savedResources, { status: 200 });
  } catch (error) {
    console.error("GET /api/savedResource/[userId] error:", error);
    return NextResponse.json({ error: "Failed to fetch saved resources" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const body = await req.json();
    const { resource_ids, resourceId, action } = body;

    let updatedSavedResources;

    if (Array.isArray(resource_ids)) {
      updatedSavedResources = await SavedResourceModel.findOneAndUpdate(
        { user_id: userId },
        { $set: { resource_ids } },
        { new: true, runValidators: true },
      );
    } else if (resourceId && action === "add") {
      updatedSavedResources = await SavedResourceModel.findOneAndUpdate(
        { user_id: userId },
        { $addToSet: { resource_ids: resourceId } },
        { new: true, runValidators: true },
      );
    } else if (resourceId && action === "remove") {
      updatedSavedResources = await SavedResourceModel.findOneAndUpdate(
        { user_id: userId },
        { $pull: { resource_ids: resourceId } },
        { new: true, runValidators: true },
      );
    } else {
      return NextResponse.json(
        { error: "Provide either resource_ids array or resourceId with action add/remove" },
        { status: 400 },
      );
    }

    if (!updatedSavedResources) {
      return NextResponse.json({ error: "Saved resources not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSavedResources, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/savedResource/[userId] error:", error);
    return NextResponse.json({ error: "Failed to update saved resources" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const deletedSavedResources = await SavedResourceModel.findOneAndDelete({
      user_id: userId,
    });

    if (!deletedSavedResources) {
      return NextResponse.json({ error: "Saved resources not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Saved resources deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/savedResource/[userId] error:", error);
    return NextResponse.json({ error: "Failed to delete saved resources" }, { status: 500 });
  }
}
