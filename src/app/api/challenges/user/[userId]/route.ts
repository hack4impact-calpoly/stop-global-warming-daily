import { NextResponse } from "next/server";
import { Types } from "mongoose";
import ChallengeModel from "@/database/challengeSchema";
import TaskModel from "@/database/taskSchema";
import TaskAssignment from "@/database/taskAssignmentSchema";
import connectDB from "@/database/db";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  try {
    await connectDB();

    const { userId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const userObjectId = new Types.ObjectId(userId);

    const challenges = await ChallengeModel.find({
      users: userObjectId,
    }).lean();

    if (!challenges.length) {
      return NextResponse.json([], { status: 200 });
    }

    const allTaskIds = challenges.flatMap((challenge: any) => (challenge.task_ids || []).map((id: any) => String(id)));

    const uniqueTaskIds = [...new Set(allTaskIds)].filter((id) => Types.ObjectId.isValid(id));

    const tasks = await TaskModel.find({
      _id: { $in: uniqueTaskIds },
    }).lean();

    const taskById = new Map(tasks.map((task: any) => [String(task._id), task]));

    const assignments = await TaskAssignment.find({
      user_id: userObjectId,
      task_id: { $in: uniqueTaskIds },
    })
      .sort({ date: -1 })
      .lean();

    const latestAssignmentByTaskId = new Map<string, any>();

    assignments.forEach((assignment: any) => {
      const key = String(assignment.task_id);
      if (!latestAssignmentByTaskId.has(key)) {
        latestAssignmentByTaskId.set(key, assignment);
      }
    });

    const response = challenges.map((challenge: any) => {
      const tasksForChallenge = (challenge.task_ids || [])
        .map((taskId: any) => {
          const task = taskById.get(String(taskId));
          if (!task) return null;

          const assignment = latestAssignmentByTaskId.get(String(taskId));

          return {
            _id: String(task._id),
            title: task.title,
            description: task.description,
            points: task.time ?? task.points ?? 0,
            completed: assignment?.isComplete ?? false,
            dueDate: assignment?.date ?? new Date().toISOString(),
          };
        })
        .filter(Boolean);

      const completedCount = tasksForChallenge.filter((task: any) => task.completed).length;
      const completionPercentage =
        tasksForChallenge.length === 0 ? 0 : Math.round((completedCount / tasksForChallenge.length) * 100);

      return {
        _id: String(challenge._id),
        title: challenge.title,
        task_ids: (challenge.task_ids || []).map((id: any) => String(id)),
        users: (challenge.users || []).map((id: any) => String(id)),
        tasks: tasksForChallenge,
        completionPercentage,
      };
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("GET /api/challenges/user/[userId] error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
