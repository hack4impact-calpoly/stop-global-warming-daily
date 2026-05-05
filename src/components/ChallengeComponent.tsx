import React, { useEffect, useState } from "react";
import { Collapsible, Progress, Text } from "@chakra-ui/react";
import TaskCard from "@/components/TaskCard";
import Style from "@/styles/ChallengeComponent.module.css";
import SwipeableTaskCard from "./SwipeableTaskCard";

export type ChallengeTask = {
  _id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  dueDate: string;
};

export type ChallengeSummary = {
  _id: string;
  title: string;
  task_ids: string[];
  users: string[];
};

interface ChallengeComponentProps {
  challenge: ChallengeSummary;
  tasks: ChallengeTask[];
  completionPercentage: number;
  defaultOpen?: boolean;
  userId?: string;
}

export default function ChallengeComponent({
  challenge,
  tasks,
  completionPercentage,
  defaultOpen = false,
  userId,
}: ChallengeComponentProps) {
  const safeCompletion = Math.min(100, Math.max(0, completionPercentage));
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const updateCompletion = async (taskId: string, completed: boolean) => {
    if (!userId) return;

    let previousCompleted: boolean | undefined;

    setLocalTasks((prev) =>
      prev.map((t) => {
        if (t._id === taskId) {
          previousCompleted = t.completed;
          if (t.completed === completed) return t;
          return { ...t, completed };
        }
        return t;
      }),
    );
    // const previousCompleted = task.completed;
    // setTask((prev) => (prev ? { ...prev, completed } : prev));

    try {
      // TODO: make API route that gets taskAssignments based on userId and challengeId
      /*
      const res = await fetch(`/api/taskAssignment/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isComplete: completed }),
      });
      

      if (!res.ok) throw new Error("Failed to update task completion");
      */
    } catch (error) {
      console.error("Failed to update completion:", error);
      // setTask((prev) => (prev ? { ...prev, completed: previousCompleted } : prev));
    }
  };

  const markComplete = (task: ChallengeTask) => {
    updateCompletion(task._id, true);
  };

  const markIncomplete = (task: ChallengeTask) => {
    updateCompletion(task._id, false);
  };

  return (
    <Collapsible.Root defaultOpen={defaultOpen} className={Style.challengeContainer}>
      <Collapsible.Trigger className={Style.challengeTrigger}>
        <div className={Style.challengeHeader}>
          <Text className={Style.challengeTitle}>{challenge.title}</Text>
          <div className={Style.challengeCompletion}>
            <Text className={Style.challengeCompletionValue}>{safeCompletion}%</Text>
            <Text className={Style.challengeCompletionLabel}>Complete</Text>
          </div>
        </div>
        <Progress.Root value={safeCompletion} size="sm" className={Style.progressRoot}>
          <Progress.Track className={Style.progressTrack}>
            <Progress.Range className={Style.progressRange} style={{ backgroundColor: "#296184" }} />
          </Progress.Track>
        </Progress.Root>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <div className={Style.challengeTasks}>
          {localTasks.map((task) => (
            <SwipeableTaskCard
              key={task._id}
              date={new Date(task.dueDate)}
              title={task.title}
              description={task.description}
              minEstimate={task.points}
              completed={task.completed}
              onSwipeRight={() => markComplete(task)}
              onSwipeLeft={() => markIncomplete(task)}
            />
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
