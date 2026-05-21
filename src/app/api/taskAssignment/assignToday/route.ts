import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/database/db";
import TaskAssignment from "@/database/taskAssignmentSchema";
import Task from "@/database/taskSchema";

const getTodayDate = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { user_id } = body;

    if (!user_id || !Types.ObjectId.isValid(user_id)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const { start, end } = getTodayDate();

    const randomTasks = await Task.aggregate([{ $sample: { size: 1 } }]);

    const assignment = await TaskAssignment.findOneAndUpdate(
      {
        user_id,
        challenge_id: { $exists: false },
        date: { $gte: start, $lt: end },
      },
      {
        $setOnInsert: {
          user_id,
          task_id: randomTasks[0]._id,
          date: start,
          isComplete: false,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Assign today failed:", error);

    return NextResponse.json({ error: "Failed to assign today's task" }, { status: 500 });
  }
}
