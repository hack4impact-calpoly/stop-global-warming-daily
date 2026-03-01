"use client";
import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import TaskCardExpanded from "@/components/TaskCardExpanded";
import { INITIAL_TASKS } from "@/data/dummyTasks"; //dummy data

export default function DayView() {
  const fifthTask = INITIAL_TASKS[4];
  return (
    <VStack>
      <CalendarSubHeader date="January 5th"></CalendarSubHeader>
      <Box>Progress Bar</Box>

      {fifthTask && (
        <TaskCardExpanded
          key={fifthTask.id}
          title={fifthTask.title}
          category={fifthTask.category}
          description={fifthTask.description}
          minEstimate={fifthTask.minEstimate}
          completed={fifthTask.completed}
        />
      )}
    </VStack>
  );
}
