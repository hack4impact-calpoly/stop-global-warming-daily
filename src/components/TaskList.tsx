"use client";
import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import SwipeableTaskCard from "@/components/SwipeableTaskCard";

export interface Task {
  id: string;
  date: Date;
  title: string;
  description: string;
  minEstimate: number;
  completed: boolean;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    date: new Date(2025, 0, 4),
    title: "Sort Recycling Bin",
    description: "Separate paper, plastic, and glass into the correct recycling bins before collection day.",
    minEstimate: 15,
    completed: true,
  },
  {
    id: "2",
    date: new Date(2025, 0, 5),
    title: "Switch to LED Bulbs",
    description: "Replace old incandescent bulbs in the kitchen and living room with energy-efficient LEDs.",
    minEstimate: 20,
    completed: false,
  },
  {
    id: "3",
    date: new Date(2025, 0, 6),
    title: "Plan a Meatless Meal",
    description: "Cook one plant-based dinner this week to reduce your dietary carbon footprint.",
    minEstimate: 20,
    completed: false,
  },
  {
    id: "4",
    date: new Date(2025, 0, 7),
    title: "Take Public Transit",
    description: "Swap your usual car commute for the bus or train and track the emissions you saved.",
    minEstimate: 10,
    completed: false,
  },
  {
    id: "5",
    date: new Date(2025, 0, 8),
    title: "Unplug Idle Electronics",
    description: "Walk through your home and unplug chargers, TVs, and appliances that aren't in use.",
    minEstimate: 10,
    completed: false,
  },
  {
    id: "6",
    date: new Date(2025, 0, 9),
    title: "Bring a Reusable Bag",
    description: "Grab your reusable shopping bag before heading to the grocery store today.",
    minEstimate: 5,
    completed: false,
  },
  {
    id: "7",
    date: new Date(2025, 0, 10),
    title: "Take a Shorter Shower",
    description: "Try cutting your shower time by 2 minutes to conserve water and reduce energy use.",
    minEstimate: 5,
    completed: false,
  },
];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const markComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const markIncomplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: false } : t)));
  };

  return (
    <VStack w="full" paddingX="20px" paddingBottom="20px" gap={0}>
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
