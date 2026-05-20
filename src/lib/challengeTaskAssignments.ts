import { Types } from "mongoose";
import TaskAssignment from "@/database/taskAssignmentSchema";

type ChallengeAssignmentSyncInput = {
  challengeId: string;
  userIds: string[];
  taskIds: string[];
};

const toObjectIdString = (value: unknown) => {
  if (typeof value === "string" && Types.ObjectId.isValid(value)) {
    return value;
  }

  if (value && typeof value === "object" && "toString" in value && Types.ObjectId.isValid(value.toString())) {
    return value.toString();
  }

  return null;
};

export const toUniqueObjectIdStrings = (values: unknown) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.map(toObjectIdString).filter((value): value is string => value !== null))];
};

const toObjectIds = (ids: string[]) => ids.map((id) => new Types.ObjectId(id));

const buildUpsertOperations = ({ challengeId, userIds, taskIds }: ChallengeAssignmentSyncInput) => {
  const challengeObjectId = new Types.ObjectId(challengeId);

  return userIds.flatMap((userId) =>
    taskIds.map((taskId) => ({
      updateOne: {
        filter: {
          challenge_id: challengeObjectId,
          user_id: new Types.ObjectId(userId),
          task_id: new Types.ObjectId(taskId),
        },
        update: {
          $setOnInsert: {
            challenge_id: challengeObjectId,
            user_id: new Types.ObjectId(userId),
            task_id: new Types.ObjectId(taskId),
            isComplete: false,
          },
        },
        upsert: true,
      },
    })),
  );
};

export const upsertChallengeTaskAssignments = async ({
  challengeId,
  userIds,
  taskIds,
}: ChallengeAssignmentSyncInput) => {
  console.log("upsert input:", { challengeId, userIds, taskIds });
  if (!userIds.length || !taskIds.length) {
    console.log("Skipping assignment creation because userIds or taskIds is empty");
    return { assignmentPairs: 0 };
  }

  const operations = buildUpsertOperations({ challengeId, userIds, taskIds });

  if (operations.length > 0) {
    await TaskAssignment.bulkWrite(operations, { ordered: false });
  }

  return { assignmentPairs: operations.length };
};

export const syncChallengeTaskAssignments = async ({ challengeId, userIds, taskIds }: ChallengeAssignmentSyncInput) => {
  const challengeObjectId = new Types.ObjectId(challengeId);

  if (!userIds.length || !taskIds.length) {
    await TaskAssignment.deleteMany({ challenge_id: challengeObjectId });
    return { assignmentPairs: 0 };
  }

  await TaskAssignment.deleteMany({
    challenge_id: challengeObjectId,
    $or: [{ user_id: { $nin: toObjectIds(userIds) } }, { task_id: { $nin: toObjectIds(taskIds) } }],
  });

  return upsertChallengeTaskAssignments({ challengeId, userIds, taskIds });
};
