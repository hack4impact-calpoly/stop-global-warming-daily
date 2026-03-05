"use client";

import { HStack, VStack, Text, Icon, Box } from "@chakra-ui/react";
import { FaFire } from "react-icons/fa";

type DayItem = { label: string; offset: number; isToday: boolean };

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

function getCenteredDayItems(): DayItem[] {
  const todayIndex = new Date().getDay(); // 0..6
  const offsets = [-2, -1, 0, 1, 2];
  return offsets.map((offset) => {
    const idx = (todayIndex + offset + 7) % 7;
    return { label: DAY_LABELS[idx], offset, isToday: offset === 0 };
  });
}

export default function MultiDayStreak({ streakDays }: { streakDays: number }) {
  const days = getCenteredDayItems();

  return (
    <VStack align="start" flex="1" gap={0}>
      {/* Title + subtitle grouped tightly */}
      <VStack align="start" gap={0}>
        <Text fontSize="22px" fontWeight="bold" color="gray.800">
          {streakDays} day streak
        </Text>

        <Text fontSize="lg" color="gray.600">
          You&apos;re on a roll!
        </Text>
      </VStack>

      {/* Day row */}
      <HStack pt={3} gap={4}>
        {days.map((day) => {
          // active if day is today or previous and within streak length
          const active = day.offset <= 0 && Math.abs(day.offset) < Math.max(1, streakDays);

          return (
            <VStack key={`${day.label}-${day.offset}`} gap={2} align="center">
              <Text fontSize="sm" color="gray.600">
                {day.label}
              </Text>

              {active ? (
                // active flames (today and previous days covered by the streak)
                <Icon as={FaFire} boxSize={5} color="cyan.600" />
              ) : (
                // inactive placeholder dots/circles
                <Box w="18px" h="18px" borderRadius="full" bg="gray.200" />
              )}
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
}
