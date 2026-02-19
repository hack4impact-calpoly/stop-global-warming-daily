import React from "react";
import { Collapsible, Progress, Text } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import Style from "../styles/ChallengeComponent.module.css";

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
  color: string;
};

interface ChallengeComponentProps {
  challenge: ChallengeSummary;
  tasks: ChallengeTask[];
  completionPercentage: number;
  defaultOpen?: boolean;
}

export default function ChallengeComponent({
  challenge,
  tasks,
  completionPercentage,
  defaultOpen = false,
}: ChallengeComponentProps) {
  const safeCompletion = Math.min(100, Math.max(0, completionPercentage));

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
            <Progress.Range className={Style.progressRange} style={{ backgroundColor: challenge.color }} />
          </Progress.Track>
        </Progress.Root>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <div className={Style.challengeTasks} style={{ backgroundColor: `${challenge.color}12` }}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              date={new Date(task.dueDate)}
              title={task.title}
              description={task.description}
              minEstimate={task.points}
              completed={task.completed}
            />
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
