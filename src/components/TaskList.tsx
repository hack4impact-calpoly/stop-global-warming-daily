"use client";
import { useEffect, useState } from "react";
import { Text, VStack } from "@chakra-ui/react";
import SwipeableTaskCard from "@/components/SwipeableTaskCard";

export interface Task {
  assignmentId: string;
  id: string;
  date: Date;
  title: string;
  description: string;
  minEstimate: number;
  completed: boolean;
  tags: string[];
}

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
  time: number;
  tags?: string[];
};

type TaskListProps = {
  userId?: string;
  showHeader?: boolean;
  onCompletionUpdated?: () => void;
};

export default function TaskList({ userId, showHeader = true, onCompletionUpdated }: TaskListProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTaskIdFromAssignment = (assignment: TaskAssignmentResponse) => {
      if (typeof assignment.task_id === "string") return assignment.task_id;
      return assignment.task_id?._id;
    };

    const fetchTask = async () => {
      if (!userId) {
        setTask(null);
        return;
      }

      setIsLoading(true);

      try {
        const assignmentRes = await fetch(`/api/taskAssignment/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!assignmentRes.ok) throw new Error("Failed to fetch task assignment");

        const assignments: TaskAssignmentResponse[] = await assignmentRes.json();

        if (assignments.length === 0) {
          setTask(null);
          return;
        }

        const assignment = assignments[0];
        const taskId = getTaskIdFromAssignment(assignment);

        if (!taskId) throw new Error("Task assignment has no task id");

        const taskRes = await fetch(`/api/task/${taskId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!taskRes.ok) throw new Error("Failed to fetch task");

        const taskData: TaskResponse = await taskRes.json();

        setTask({
          assignmentId: assignment._id,
          id: taskData._id,
          date: new Date(assignment.date),
          title: taskData.title,
          description: taskData.description,
          minEstimate: taskData.time,
          completed: assignment.isComplete,
          tags: Array.isArray(taskData.tags) ? taskData.tags : [],
        });
      } catch (error) {
        console.error("Failed to load daily task:", error);
        setTask(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [userId]);

  const updateCompletion = async (completed: boolean) => {
    if (!task || !userId || task.completed === completed) return;

    const previousCompleted = task.completed;
    setTask((prev) => (prev ? { ...prev, completed } : prev));

    try {
      const res = await fetch(`/api/taskAssignment/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComplete: completed }),
      });

      if (!res.ok) throw new Error("Failed to update task completion");
      onCompletionUpdated?.();
    } catch (error) {
      console.error("Failed to update completion:", error);
      setTask((prev) => (prev ? { ...prev, completed: previousCompleted } : prev));
    }
  };

  const markComplete = (id: string) => {
    if (task?.id !== id) return;
    updateCompletion(true);
  };

  const markIncomplete = (id: string) => {
    if (task?.id !== id) return;
    updateCompletion(false);
  };

  return (
    <VStack w="full" paddingX="20px" paddingBottom="20px" gap={0} alignItems="stretch">
      {showHeader && (
        <Text fontSize="sm" fontWeight="semibold" color="gray.600" pb={3}>
          Daily Task
        </Text>
      )}
      {task ? (
        <SwipeableTaskCard
          date={task.date}
          title={task.title}
          description={task.description}
          minEstimate={task.minEstimate}
          completed={task.completed}
          tags={task.tags}
          onSwipeRight={() => markComplete(task.id)}
          onSwipeLeft={() => markIncomplete(task.id)}
        />
      ) : (
        <Text color="gray.500" fontSize="sm">
          {isLoading ? "Loading task..." : "No task assigned for today."}
        </Text>
      )}
    </VStack>
  );
}
