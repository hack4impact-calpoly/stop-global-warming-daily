"use client";

import { Box, HStack } from "@chakra-ui/react";
import ProgressRing from "@/components/ProgressRing";
import MultiDayStreak from "@/components/MultiDayStreak";

interface StreakCardProps {
  streak?: number;
  completedDates?: (string | Date)[];
}

export default function StreakCard({ streak = 0, completedDates = [] }: StreakCardProps) {
  const percent = getStreakProgress(streak);
  const goal = getNextGoal(streak);
  return (
    <Box w="full" bg="#F9FAFB" borderRadius="8px" p="10px" boxShadow="0px 1px 8px rgba(89, 91, 98, 0.1)">
      <HStack align="center" gap={5}>
        <ProgressRing percent={percent} size="140px" thickness="10px" />
        <MultiDayStreak streakDays={streak} completedDates={completedDates} />
      </HStack>
    </Box>
  );
}
function getNextGoal(streak: number): number {
  const milestones = [3, 5, 7, 10, 20, 30, 40];

  for (const milestone of milestones) {
    if (streak < milestone) {
      return milestone;
    }
  }

  // after 40, goals go up by 10
  return (Math.floor(streak / 10) + 1) * 10;
}

function getStreakProgress(streak: number): number {
  if (streak <= 0) return 0;

  const goal = getNextGoal(streak);

  return Math.min(100, Math.round((streak / goal) * 100));
}
