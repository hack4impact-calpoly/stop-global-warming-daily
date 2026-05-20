import ChallengeModel from "@/database/challengeSchema";
import { Types } from "mongoose";
import { upsertChallengeTaskAssignments, toUniqueObjectIdStrings } from "./challengeTaskAssignments";

export const addNewUserToActiveChallenges = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const userObjectId = new Types.ObjectId(userId);

  const activeChallenges = await ChallengeModel.find({ isActive: true }).select("_id users task_ids");

  for (const challenge of activeChallenges) {
    const challengeId = challenge._id.toString();

    await ChallengeModel.updateOne({ _id: challenge._id }, { $addToSet: { users: userObjectId } });

    const taskIds = toUniqueObjectIdStrings(challenge.tasks);

    await upsertChallengeTaskAssignments({
      challengeId,
      userIds: [userId],
      taskIds,
    });
  }

  return { challengesJoined: activeChallenges.length };
};
