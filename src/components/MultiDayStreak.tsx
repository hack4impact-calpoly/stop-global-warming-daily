"use client";

import { HStack, VStack, Text, Box, Image } from "@chakra-ui/react";

type DayItem = { label: string; offset: number; isToday: boolean };

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
//Genarated messages for sreak
function getStreakMessage(streakDays: number): string {
  if (streakDays <= 0) return "Start your streak today!";
  if (streakDays === 1) return "Nice start!";
  if (streakDays < 3) return "Keep it going!";
  if (streakDays < 5) return "You're building momentum!";
  if (streakDays < 7) return "You're on a roll!";
  if (streakDays < 10) return "One full week strong!";
  if (streakDays < 20) return "Amazing consistency!";
  if (streakDays < 30) return "You're crushing it!";
  return "Legendary streak!";
}

function getCenteredDayItems(): DayItem[] {
  const todayIndex = new Date().getDay(); // 0..6
  const offsets = [-2, -1, 0, 1, 2];
  return offsets.map((offset) => {
    const idx = (todayIndex + offset + 7) % 7;
    return { label: DAY_LABELS[idx], offset, isToday: offset === 0 };
  });
}

interface MultiDayStreakProps {
  streakDays: number;
  completedDates?: (string | Date)[];
}

export default function MultiDayStreak({ streakDays, completedDates = [] }: MultiDayStreakProps) {
  const days = getCenteredDayItems();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completedSet = new Set(
    completedDates.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }),
  );

  return (
    <VStack align="start" flex="1" gap={1}>
      {/* Title + subtitle grouped tightly */}
      <VStack align="start" gap={0}>
        <Text fontSize="22px" fontWeight="bold" color="#3B3B3B">
          {streakDays} day streak
        </Text>

        <Text fontSize="lg" color="#3B3B3B" textWrap={"nowrap"}>
          {getStreakMessage(streakDays)}
        </Text>
      </VStack>

      {/* Day row */}
      <HStack pt={3} gap={2}>
        {days.map((day) => {
          // Resolve the calendar date for this display slot
          const slotDate = new Date(today);
          slotDate.setDate(today.getDate() + day.offset);
          slotDate.setHours(0, 0, 0, 0);

          // Show flame only if the user actually completed that day
          const active = completedSet.has(slotDate.getTime());

          return (
            <VStack key={`${day.label}-${day.offset}`} gap={0} align="center">
              <Text fontSize="sm" color="gray.600">
                {day.label}
              </Text>

              {active ? (
                <Image src="/images/flame.svg" alt="streak-flame" w="25px" h="30px" />
              ) : (
                <Box w="25px" h="25px" mt="5px" borderRadius="full" bg="gray.200" />
              )}
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
}
