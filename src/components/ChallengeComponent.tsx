import React, { useEffect, useState } from "react";
import { Collapsible, Progress, Text } from "@chakra-ui/react";
import Style from "@/styles/ChallengeComponent.module.css";
import SwipeableTaskCard from "./SwipeableTaskCard";

export type ChallengeTask = {
  assignmentId?: string;
  _id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  dueDate: string;
  tags?: string[];
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
  const [localTasks, setLocalTasks] = useState(tasks);
  const localCompletionPercentage =
    localTasks.length === 0
      ? completionPercentage
      : Math.round((localTasks.filter((task) => task.completed).length / localTasks.length) * 100);
  const safeCompletion = Math.min(100, Math.max(0, localCompletionPercentage));

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const updateCompletion = async (taskId: string, assignmentId: string | undefined, completed: boolean) => {
    if (!userId) return;

    const previousTasks = localTasks;

    setLocalTasks((prev) =>
      prev.map((t) => {
        if (t._id === taskId) {
          if (t.completed === completed) return t;
          return { ...t, completed };
        }
        return t;
      }),
    );

    try {
      if (!assignmentId) {
        throw new Error("Missing challenge assignment id");
      }

      const res = await fetch(`/api/taskAssignment/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId,
          isComplete: completed,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task completion");
    } catch (error) {
      console.error("Failed to update completion:", error);
      setLocalTasks(previousTasks);
    }
  };

  const markComplete = (task: ChallengeTask) => {
    updateCompletion(task._id, task.assignmentId, true);
  };

  const markIncomplete = (task: ChallengeTask) => {
    updateCompletion(task._id, task.assignmentId, false);
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
              tags={task.tags ?? []}
              onSwipeRight={() => markComplete(task)}
              onSwipeLeft={() => markIncomplete(task)}
            />
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
