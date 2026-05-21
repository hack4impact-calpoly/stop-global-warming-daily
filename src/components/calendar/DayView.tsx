"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import TaskCardExpanded from "@/components/TaskCardExpanded";
import { IUsers } from "@/database/userSchema";

type DailyViewProps = {
  userData: IUsers | null;
  selectedDate: Date;
  progressBar: boolean;
  setUserData?: Dispatch<SetStateAction<IUsers | null>>;
};

type TaskAssignmentResponse = {
  _id: string;
  task_id: string | { _id: string };
  date: string;
  isComplete: boolean;
};

type TaskResponse = {
  _id: string;
  title: string;
  description: string;
  time?: number;
  points?: number;
  tags?: string[];
};

type DailyTask = {
  assignmentId: string;
  id: string;
  title: string;
  description: string;
  minEstimate: number;
  completed: boolean;
  category: string;
};

const getTaskIdFromAssignment = (assignment: TaskAssignmentResponse) => {
  if (typeof assignment.task_id === "string") return assignment.task_id;
  return assignment.task_id?._id;
};

const getNextGoal = (streak: number) => {
  if (streak < 3) return 3;
  if (streak < 5) return 7;
  if (streak < 10) return 10;
  if (streak < 20) return 20;
  if (streak < 30) return 30;
  if (streak < 40) return 40;
  if (streak < 50) return 50;
  return Math.ceil((streak + 1) / 7) * 7;
};

export default function DayView({ userData, selectedDate, progressBar, setUserData }: DailyViewProps) {
  const [task, setTask] = useState<DailyTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchDailyTask = async () => {
      const userId = userData?._id ? String(userData._id) : undefined;

      if (!userId) {
        setTask(null);
        return;
      }

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          date: selectedDate.toISOString(),
          range: "day",
        });

        const assignmentRes = await fetch(`/api/taskAssignment/${userId}?${params.toString()}`);
        if (!assignmentRes.ok) throw new Error("Failed to fetch daily assignment");

        const assignments: TaskAssignmentResponse[] = await assignmentRes.json();
        if (assignments.length === 0) {
          setTask(null);
          return;
        }

        const assignment = assignments[0];
        const taskId = getTaskIdFromAssignment(assignment);
        if (!taskId) throw new Error("Task assignment has no task id");

        const taskRes = await fetch(`/api/task/${taskId}`);
        if (!taskRes.ok) throw new Error("Failed to fetch task");

        const taskData: TaskResponse = await taskRes.json();

        setTask({
          assignmentId: assignment._id,
          id: taskData._id,
          title: taskData.title,
          description: taskData.description,
          minEstimate:
            typeof taskData.time === "number"
              ? taskData.time
              : typeof taskData.points === "number"
                ? taskData.points
                : 0,
          completed: assignment.isComplete,
          category: taskData.tags?.[0] ?? "Daily Task",
        });
      } catch (error) {
        console.error("Failed to load daily task:", error);
        setTask(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTask();
  }, [selectedDate, userData]);

  const markComplete = async () => {
    const userId = userData?._id ? String(userData._id) : undefined;
    if (!task || !userId || task.completed) return;

    const previousTask = task;
    setIsUpdating(true);
    setTask({ ...task, completed: true });

    try {
      const res = await fetch(`/api/taskAssignment/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: task.assignmentId,
          isComplete: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task completion");
      }

      if (setUserData) {
        setUserData((userData) => {
          if (!userData) return userData;
          return {
            ...userData,
            streak: userData.streak + 1,
          };
        });
      }
    } catch (error) {
      console.error("Failed to mark task complete:", error);
      setTask(previousTask);
    } finally {
      setIsUpdating(false);
    }
  };

  const streak = userData?.streak ?? 0;
  const nextGoal = useMemo(() => getNextGoal(streak), [streak]);
  const progressPercent = Math.min((streak / nextGoal) * 100, 100);

  return (
    <VStack w="full" align="stretch" gap={3}>
      {progressBar && (
        <>
          <Box w="full" h="12px" bg="#DCE4EC" borderRadius="full" overflow="hidden">
            <Box h="100%" w={`${progressPercent}%`} bg="#64B9FF" borderRadius="full" />
          </Box>
          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Current streak: {streak} days
            </Text>
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              Next goal: {nextGoal} days
            </Text>
          </HStack>
        </>
      )}

      {task ? (
        <TaskCardExpanded
          title={task.title}
          category={task.category}
          minEstimate={task.minEstimate}
          completed={task.completed}
          description={task.description}
          onComplete={markComplete}
          buttonLabel={task.completed ? "Completed" : isUpdating ? "Saving..." : "Complete"}
          buttonDisabled={task.completed || isUpdating}
        />
      ) : (
        <Box bg="white" p={4} borderRadius="16px" boxShadow="0px 1px 8px rgba(89, 91, 98, 0.1)">
          <Text color="gray.500" fontSize="sm">
            {isLoading ? "Loading task..." : "No task assigned for this day."}
          </Text>
        </Box>
      )}
    </VStack>
  );
}
