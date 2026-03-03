"use client";
import { useEffect, useState } from "react";
import { Text, VStack } from "@chakra-ui/react";
import TaskCard from "@/components/TaskCard";

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
};

type WeeklyTask = {
  assignmentId: string;
  taskId: string;
  date: Date;
  title: string;
  description: string;
  minEstimate: number;
  completed: boolean;
};

type WeeklyTaskListProps = {
  userId?: string;
  referenceDate: Date;
};

export default function WeeklyTaskList({ userId, referenceDate }: WeeklyTaskListProps) {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTaskIdFromAssignment = (assignment: TaskAssignmentResponse) => {
      if (typeof assignment.task_id === "string") return assignment.task_id;
      return assignment.task_id?._id;
    };

    const fetchWeekTasks = async () => {
      if (!userId) {
        setTasks([]);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          range: "week",
          date: referenceDate.toISOString(),
        });

        const assignmentsRes = await fetch(`/api/taskAssignment/${userId}?${params.toString()}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!assignmentsRes.ok) throw new Error("Failed to fetch weekly assignments");

        const assignments: TaskAssignmentResponse[] = await assignmentsRes.json();
        if (assignments.length === 0) {
          setTasks([]);
          return;
        }

        const weeklyTasks = await Promise.all(
          assignments.map(async (assignment) => {
            const taskId = getTaskIdFromAssignment(assignment);
            if (!taskId) return null;

            const taskRes = await fetch(`/api/task/${taskId}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            if (!taskRes.ok) return null;

            const task: TaskResponse = await taskRes.json();
            const minEstimate =
              typeof task.time === "number" ? task.time : typeof task.points === "number" ? task.points : 0;

            return {
              assignmentId: assignment._id,
              taskId: task._id,
              date: new Date(assignment.date),
              title: task.title,
              description: task.description,
              minEstimate,
              completed: assignment.isComplete,
            } satisfies WeeklyTask;
          }),
        );

        setTasks(
          weeklyTasks
            .filter((task): task is WeeklyTask => task !== null)
            .sort((a, b) => a.date.getTime() - b.date.getTime()),
        );
      } catch (error) {
        console.error("Failed to load weekly tasks:", error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeekTasks();
  }, [referenceDate, userId]);

  return (
    <VStack align="stretch" w="full" pt={2}>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task.assignmentId}
            date={task.date}
            title={task.title}
            description={task.description}
            minEstimate={task.minEstimate}
            completed={task.completed}
          />
        ))
      ) : (
        <Text color="gray.500" fontSize="sm" px={1}>
          {isLoading ? "Loading weekly tasks..." : "No tasks assigned for this week."}
        </Text>
      )}
    </VStack>
  );
}
