"use client";
import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import SwipeableTaskCard from "@/components/SwipeableTaskCard";
import { INITIAL_TASKS, Task } from "@/data/dummyTasks";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const markComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const markIncomplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: false } : t)));
  };

  return (
    <VStack w="full" paddingBottom="20px" gap={0}>
      {tasks.map((task) => (
        <SwipeableTaskCard
          key={task.id}
          date={task.date}
          title={task.title}
          description={task.description}
          minEstimate={task.minEstimate}
          completed={task.completed}
          onSwipeRight={() => markComplete(task.id)}
          onSwipeLeft={() => markIncomplete(task.id)}
        />
      ))}
    </VStack>
  );
}
