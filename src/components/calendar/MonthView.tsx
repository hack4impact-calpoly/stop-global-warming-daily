"use client";
import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import MonthlyCalendar from "../MonthlyCalendar";
import { JANUARY_2025 } from "@/data/dummyMonthData"; //dummy data

export default function MonthView() {
  return (
    <VStack>
      <CalendarSubHeader date="January 2026"></CalendarSubHeader>
      <Box>Progress Bar</Box>
      <MonthlyCalendar days={JANUARY_2025} />
    </VStack>
  );
}
