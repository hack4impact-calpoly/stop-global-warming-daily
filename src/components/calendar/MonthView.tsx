"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import type { CalendarDay, DayCategory } from "@/data/dummyMonthData";
import MonthlyCalendar from "../calendar/MonthlyCalendar";

type MonthViewProps = {
  selectedDate?: Date;
  userId?: string;
};

type CalendarAssignment = {
  date: string;
  isComplete: boolean;
};

const getDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function MonthView({ selectedDate = new Date(), userId }: MonthViewProps) {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMonthData = async () => {
      if (!userId) {
        setCompletedDays(new Set());
        return;
      }

      try {
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        const res = await fetch(`/api/calendar?userId=${userId}&month=${month}&year=${year}`);
        if (!res.ok) {
          setCompletedDays(new Set());
          return;
        }

        const data: CalendarAssignment[] = await res.json();
        const nextCompleted = new Set<string>();

        data.forEach((item) => {
          if (item.isComplete) {
            const d = new Date(item.date);
            d.setHours(0, 0, 0, 0);
            nextCompleted.add(getDateKey(d));
          }
        });

        setCompletedDays(nextCompleted);
      } catch (error) {
        console.error(error);
        setCompletedDays(new Set());
      }
    };

    fetchMonthData();
  }, [selectedDate, userId]);

  const days = useMemo(() => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const startDay = new Date(firstDay);
    startDay.setDate(firstDay.getDate() - firstDay.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = getDateKey(today);

    return Array.from({ length: 42 }, (_, i): CalendarDay => {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const key = getDateKey(date);

      let category: DayCategory = "futureOrUncompleted";

      if (date.getMonth() !== selectedDate.getMonth()) {
        category = "outsideMonth";
      } else if (completedDays.has(key)) {
        category = "completed";
      } else if (key === todayKey) {
        category = "current";
      }

      return {
        label: String(date.getDate()),
        category,
      };
    });
  }, [selectedDate, completedDays]);

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

  const completedCount = days.filter((day) => day.category === "completed").length;
  const progressPercent = daysInMonth === 0 ? 0 : (completedCount / daysInMonth) * 100;

  return (
    <VStack w="full" align="stretch" gap={2}>
      <Box w="full" h="14px" bg="#DCE4EC" borderRadius="full" overflow="hidden">
        <Box h="100%" w={`${progressPercent}%`} bg="#79B8FF" borderRadius="full" />
      </Box>

      <Text fontSize="sm" fontWeight="medium">
        {completedCount} of {daysInMonth} days completed
      </Text>

      <MonthlyCalendar days={days} />
    </VStack>
  );
}
