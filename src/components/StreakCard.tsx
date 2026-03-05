"use client";

import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import ProgressRing from "@/components/ProgressRing";
import MultiDayStreak from "@/components/MultiDayStreak";

export default function StreakCard() {
  return (
    <Box w="full" bg="gray.50" borderRadius="2xl" p={5} boxShadow="sm" borderWidth="1px" borderColor="gray.100">
      <HStack align="center" gap={6}>
        <ProgressRing percent={70} isClockwise={false} size="140px" thickness="16px" />
        <MultiDayStreak streakDays={5} />
      </HStack>
    </Box>
  );
}
