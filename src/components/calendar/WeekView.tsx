"use client";
import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import TaskList from "../TaskList";
export default function WeekView() {
  return (
    <VStack>
      <CalendarSubHeader date="January 4-10"></CalendarSubHeader>
      <TaskList />
    </VStack>
  );
}
