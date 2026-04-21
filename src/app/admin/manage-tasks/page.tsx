"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Input, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuSearch, LuPlus } from "react-icons/lu";
import AdminTaskCard from "@/components/AdminTaskCard";

type TaskResponse = {
  _id: string;
  title: string;
  description?: string;
  time?: number;
};

type ChallengeResponse = {
  _id: string;
  title: string;
  task_ids?: Array<string | { _id: string }>;
};

type AdminTask = {
  id: string;
  title: string;
  description: string;
  minEstimate: number | null;
  availability: string;
};

const normalizeId = (value: string | { _id: string } | undefined) => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

const buildTaskAvailability = (taskId: string, challenges: ChallengeResponse[]) => {
  const challengeTitles = challenges
    .filter((challenge) => challenge.task_ids?.some((challengeTaskId) => normalizeId(challengeTaskId) === taskId))
    .map((challenge) => challenge.title);

  return challengeTitles.length > 0 ? challengeTitles.join(", ") : "Daily";
};

export default function ManageTasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [tasksResponse, challengesResponse] = await Promise.all([
          fetch("/api/task", { cache: "no-store" }),
          fetch("/api/challenges", { cache: "no-store" }),
        ]);

        if (!tasksResponse.ok) {
          throw new Error("Failed to load tasks");
        }

        if (!challengesResponse.ok) {
          throw new Error("Failed to load challenge availability");
        }

        const [taskData, challengeData]: [TaskResponse[], ChallengeResponse[]] = await Promise.all([
          tasksResponse.json(),
          challengesResponse.json(),
        ]);

        setTasks(
          taskData.map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description?.trim() || "No description provided.",
            minEstimate: typeof task.time === "number" ? task.time : null,
            availability: buildTaskAvailability(task._id, challengeData),
          })),
        );
      } catch (fetchError) {
        console.error("Failed to load admin tasks:", fetchError);
        setTasks([]);
        setError("Unable to load tasks right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.trim().toLowerCase()));

  const renderTaskContent = () => {
    if (isLoading) {
      return (
        <Text color="gray.500" fontSize="sm">
          Loading tasks...
        </Text>
      );
    }

    if (error) {
      return (
        <Text color="red.500" fontSize="sm">
          {error}
        </Text>
      );
    }

    if (tasks.length === 0) {
      return (
        <Text color="gray.500" fontSize="sm">
          No tasks available yet.
        </Text>
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <Text color="gray.500" fontSize="sm">
          No tasks match that title.
        </Text>
      );
    }

    return filteredTasks.map((task) => (
      <AdminTaskCard
        key={task.id}
        title={task.title}
        description={task.description}
        minEstimate={task.minEstimate}
        availability={task.availability}
      />
    ));
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb={{ base: "140px", md: "40px" }}>
        <VStack align="stretch" gap={4}>
          <HStack gap={3}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
              <LuChevronLeft size={28} />
            </Link>

            <Text fontWeight="semibold" fontSize="4xl">
              Task Manager
            </Text>
          </HStack>

          <Box position="relative">
            <Input
              placeholder="Search for a task..."
              value={searchTerm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
              bg="gray.200"
              border="none"
              borderRadius="full"
              pr="45px"
            />

            <Box
              position="absolute"
              right="14px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
              pointerEvents="none"
            >
              <LuSearch />
            </Box>
          </Box>
          <VStack align="stretch" gap={3}>
            {renderTaskContent()}
          </VStack>
        </VStack>
      </Box>

      <IconButton
        aria-label="Add task"
        position="fixed"
        bottom={{ base: "110px", md: "24px" }}
        right="24px"
        w="64px"
        h="64px"
        borderRadius="full"
        variant="outline"
        borderColor="blue.300"
        color="blue.300"
        bg="white"
        zIndex={20}
      >
        <LuPlus size={28} />
      </IconButton>
    </Box>
  );
}
