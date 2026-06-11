"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Input, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuSearch, LuPlus } from "react-icons/lu";
import AdminChallengeCard from "@/components/AdminChallengeCard";

type ChallengeResponse = {
  _id: string;
  title: string;
  description?: string;
  task_ids?: Array<string | { _id: string }>;
  users?: Array<string | { _id: string }>;
  isActive?: boolean;
};

type AdminChallenge = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
};

const formatCount = (value: number, label: string) => `${value} ${label}${value === 1 ? "" : "s"}`;

const buildChallengeDescription = (challenge: ChallengeResponse) => {
  if (challenge.description?.trim()) {
    return challenge.description.trim();
  }

  const taskCount = challenge.task_ids?.length ?? 0;
  const userCount = challenge.users?.length ?? 0;

  if (taskCount === 0 && userCount === 0) {
    return "No tasks or participants assigned yet.";
  }

  if (taskCount === 0) {
    return `${formatCount(userCount, "participant")} assigned so far.`;
  }

  if (userCount === 0) {
    return `${formatCount(taskCount, "task")} currently included in this challenge.`;
  }

  return `${formatCount(taskCount, "task")} assigned to ${formatCount(userCount, "participant")}.`;
};

export default function ManageChallengePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/challenges", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load challenges");
        }

        const challengeData: ChallengeResponse[] = await response.json();

        setChallenges(
          challengeData.map((challenge) => ({
            id: challenge._id,
            title: challenge.title,
            description: buildChallengeDescription(challenge),
            isActive: Boolean(challenge.isActive),
          })),
        );
      } catch (fetchError) {
        console.error("Failed to load admin challenges:", fetchError);
        setChallenges([]);
        setError("Unable to load challenges right now.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/challenges/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    setChallenges((prev) => prev.filter((c) => c.id !== id));
  };

  const renderChallengeContent = () => {
    if (isLoading) {
      return (
        <Text color="gray.500" fontSize="sm">
          Loading challenges...
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

    if (challenges.length === 0) {
      return (
        <Text color="gray.500" fontSize="sm">
          No challenges available yet.
        </Text>
      );
    }

    if (filteredChallenges.length === 0) {
      return (
        <Text color="gray.500" fontSize="sm">
          No challenges match that title.
        </Text>
      );
    }

    return filteredChallenges.map((challenge) => (
      <AdminChallengeCard
        key={challenge.id}
        id={challenge.id}
        title={challenge.title}
        description={challenge.description}
        isActive={challenge.isActive}
        onDelete={handleDelete}
      />
    ));
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="180px">
        <VStack align="stretch" gap={4}>
          <HStack gap={3} justify="space-between">
            <HStack gap={3}>
              <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
                <LuChevronLeft size={28} />
              </Link>
              <Text fontWeight="semibold" fontSize="4xl">
                Challenges
              </Text>
            </HStack>

            <Link href="/admin/manage-challenges/new-challenge">
              <IconButton
                aria-label="Add challenge"
                w="44px"
                h="44px"
                borderRadius="full"
                variant="outline"
                borderColor="blue.300"
                color="blue.300"
                bg="white"
                shadow="sm"
              >
                <LuPlus size={22} />
              </IconButton>
            </Link>
          </HStack>

          <Box position="relative">
            <Input
              placeholder="Search for a challenge..."
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
            {renderChallengeContent()}
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}
