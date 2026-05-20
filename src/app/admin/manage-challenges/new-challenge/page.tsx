"use client";

import { ChangeEvent, FormEvent, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Input, Textarea, Button, Spinner } from "@chakra-ui/react";
import { LuChevronLeft, LuCheck, LuSearch, LuX } from "react-icons/lu";
import { useRouter, useSearchParams } from "next/navigation";

const AVAILABLE_TAGS = [
  { label: "Shopping", color: "blue.400" },
  { label: "Sustainable Food", color: "yellow.500" },
  { label: "Waste Reduction", color: "orange.400" },
  { label: "Energy Saving", color: "teal.400" },
  { label: "Transportation", color: "purple.400" },
  { label: "Nature Preservation & Restoration", color: "cyan.400" },
  { label: "Community/Volunteering", color: "green.400" },
];

type Task = {
  id: string;
  title: string;
};

type TaskResponse = {
  _id: string;
  title: string;
};

export default function NewChallengePage() {
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Task selection state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const visibleTags = showAllTags ? AVAILABLE_TAGS : AVAILABLE_TAGS.slice(0, 5);
  const hiddenCount = AVAILABLE_TAGS.length - 5;

  const toggleTag = (label: string) => {
    setSelectedTags((prev) => (prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]));
  };

  const toggleTask = (id: string) => {
    setSelectedTaskIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const removeTask = (id: string) => {
    setSelectedTaskIds((prev) => prev.filter((t) => t !== id));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setTasksLoading(true);
      setTasksError("");
      try {
        const res = await fetch("/api/task", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load tasks");
        const data: TaskResponse[] = await res.json();
        setTasks(data.map((t) => ({ id: t._id, title: t.title })));
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setTasksError("Unable to load tasks right now.");
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(taskSearch.trim().toLowerCase()));

  const selectedTasks = tasks.filter((t) => selectedTaskIds.includes(t.id));

  const router = useRouter();
  const searchParams = useSearchParams();

  const challengeId = searchParams.get("challengeId");
  const isEditMode = Boolean(challengeId);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Challenge title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Challenge description is required.");
      return;
    }

    const time = Number(hours || 0) * 60 + Number(minutes || 0);

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(isEditMode && challengeId ? `/api/challenges/${challengeId}` : "/api/challenges", {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          tags: selectedTags,
          time,
          task_ids: selectedTaskIds,
          isActive,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? `Failed to ${isEditMode ? "update" : "create"} challenge.`);
      }

      router.push("/admin/manage-challenges");
      router.refresh();
    } catch (saveError) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} challenge:`, saveError);
      setError(
        saveError instanceof Error ? saveError.message : `Failed to ${isEditMode ? "update" : "create"} challenge.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Suspense fallback={null}>
      <Box display="flex" justifyContent="center" minH="100vh" bg="gray.50">
        <Box maxW="400px" w="full" minH="100vh" p={5} pb="120px">
          <form onSubmit={handleSave}>
            <VStack align="stretch" gap={6}>
              {/* Header */}
              <HStack gap={3}>
                <Link href="/admin/manage-challenges" style={{ display: "flex", alignItems: "center" }}>
                  <LuChevronLeft size={28} />
                </Link>
                <Text fontWeight="semibold" fontSize="4xl">
                  New Challenge
                </Text>
              </HStack>

              {/* Form Card */}
              <Box bg="white" borderRadius="xl" p={4} shadow="sm">
                <VStack align="stretch" gap={5}>
                  {/* Challenge Name */}
                  <VStack align="stretch" gap={1}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Challenge Name
                    </Text>
                    <Input
                      placeholder="Name your challenge..."
                      value={title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      bg="gray.100"
                      border="none"
                      borderRadius="lg"
                    />
                  </VStack>

                  {/* Challenge Description */}
                  <VStack align="stretch" gap={1}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Challenge Description
                    </Text>
                    <Textarea
                      placeholder="Describe your challenge..."
                      value={description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                      bg="gray.100"
                      border="none"
                      borderRadius="lg"
                      resize="none"
                      rows={4}
                    />
                  </VStack>

                  {/* Tags */}
                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Add Tags
                    </Text>
                    <HStack flexWrap="wrap" gap={2}>
                      {visibleTags.map((tag) => {
                        const selected = selectedTags.includes(tag.label);
                        return (
                          <Button
                            key={tag.label}
                            size="sm"
                            borderRadius="full"
                            variant="outline"
                            borderColor={tag.color}
                            color={tag.color}
                            bg="white"
                            onClick={() => toggleTag(tag.label)}
                            _hover={{ bg: "gray.50" }}
                          >
                            {tag.label} {selected && <LuCheck size={14} />}
                          </Button>
                        );
                      })}
                      {!showAllTags && hiddenCount > 0 && (
                        <Button
                          size="sm"
                          borderRadius="full"
                          variant="outline"
                          borderColor="gray.400"
                          color="gray.600"
                          onClick={() => setShowAllTags(true)}
                        >
                          + {hiddenCount} More
                        </Button>
                      )}
                    </HStack>
                  </VStack>

                  {/* Time to Complete */}
                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Time to Complete
                    </Text>
                    <HStack gap={2}>
                      <Input
                        type="number"
                        value={hours}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setHours(e.target.value)}
                        bg="gray.100"
                        border="none"
                        borderRadius="full"
                        w="60px"
                        textAlign="center"
                        min={0}
                      />
                      <Text fontSize="sm">Hours and</Text>
                      <Input
                        type="number"
                        value={minutes}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setMinutes(e.target.value)}
                        bg="gray.100"
                        border="none"
                        borderRadius="full"
                        w="60px"
                        textAlign="center"
                        min={0}
                        max={59}
                      />
                      <Text fontSize="sm">minutes</Text>
                    </HStack>
                  </VStack>

                  {/* Tasks */}
                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Add Tasks
                    </Text>

                    {/* Selected task chips */}
                    {selectedTasks.length > 0 && (
                      <HStack flexWrap="wrap" gap={2}>
                        {selectedTasks.map((task) => (
                          <HStack key={task.id} bg="blue.50" borderRadius="full" px={3} py={1} gap={1}>
                            <Text fontSize="xs" color="blue.600" fontWeight="medium">
                              {task.title}
                            </Text>
                            <Box
                              as="button"
                              onClick={() => removeTask(task.id)}
                              color="blue.400"
                              _hover={{ color: "blue.600" }}
                              display="flex"
                              alignItems="center"
                            >
                              <LuX size={12} />
                            </Box>
                          </HStack>
                        ))}
                      </HStack>
                    )}

                    {/* Search input */}
                    <Box position="relative">
                      <Input
                        placeholder="Search tasks..."
                        value={taskSearch}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTaskSearch(e.target.value)}
                        bg="gray.100"
                        border="none"
                        borderRadius="lg"
                        pr="40px"
                        fontSize="sm"
                      />
                      <Box
                        position="absolute"
                        right="12px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="gray.400"
                        pointerEvents="none"
                      >
                        <LuSearch size={15} />
                      </Box>
                    </Box>

                    {/* Scrollable task list */}
                    <Box
                      bg="gray.100"
                      borderRadius="lg"
                      maxH="200px"
                      overflowY="auto"
                      css={{
                        "&::-webkit-scrollbar": { width: "4px" },
                        "&::-webkit-scrollbar-track": { background: "transparent" },
                        "&::-webkit-scrollbar-thumb": { background: "#CBD5E0", borderRadius: "2px" },
                      }}
                    >
                      {tasksLoading ? (
                        <HStack justify="center" py={4}>
                          <Spinner size="sm" color="gray.400" />
                          <Text fontSize="sm" color="gray.500">
                            Loading tasks...
                          </Text>
                        </HStack>
                      ) : tasksError ? (
                        <Text fontSize="sm" color="red.500" px={3} py={3}>
                          {tasksError}
                        </Text>
                      ) : filteredTasks.length === 0 ? (
                        <Text fontSize="sm" color="gray.500" px={3} py={3}>
                          {taskSearch ? "No tasks match that search." : "No tasks available."}
                        </Text>
                      ) : (
                        filteredTasks.map((task, idx) => {
                          const isSelected = selectedTaskIds.includes(task.id);
                          const isLast = idx === filteredTasks.length - 1;
                          return (
                            <HStack
                              key={task.id}
                              px={3}
                              py={2.5}
                              gap={3}
                              cursor="pointer"
                              onClick={() => toggleTask(task.id)}
                              bg={isSelected ? "blue.50" : "transparent"}
                              borderBottom={isLast ? "none" : "1px solid"}
                              borderColor="gray.200"
                              _hover={{ bg: isSelected ? "blue.100" : "gray.200" }}
                              transition="background 0.15s"
                            >
                              <Box
                                w="18px"
                                h="18px"
                                borderRadius="sm"
                                border="2px"
                                borderColor={isSelected ? "blue.400" : "gray.400"}
                                bg={isSelected ? "blue.400" : "white"}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                                transition="all 0.15s"
                              >
                                {isSelected && (
                                  <Box color="white">
                                    <LuCheck size={11} />
                                  </Box>
                                )}
                              </Box>
                              <Text fontSize="sm" color={isSelected ? "blue.700" : "gray.700"}>
                                {task.title}
                              </Text>
                            </HStack>
                          );
                        })
                      )}
                    </Box>

                    {selectedTasks.length > 0 && (
                      <Text fontSize="xs" color="gray.500">
                        {selectedTasks.length} task{selectedTasks.length === 1 ? "" : "s"} selected
                      </Text>
                    )}
                  </VStack>

                  {/* Status */}
                  <VStack align="stretch" gap={2}>
                    <Text fontWeight="semibold" fontSize="sm">
                      Status
                    </Text>
                    <HStack gap={3} cursor="pointer" onClick={() => setIsActive((prev) => !prev)}>
                      <Box
                        w="18px"
                        h="18px"
                        borderRadius="sm"
                        border="2px"
                        borderColor="gray.500"
                        bg={isActive ? "gray.500" : "gray.200"}
                      />
                      <Text fontSize="sm">Active</Text>
                    </HStack>
                  </VStack>

                  {error && (
                    <Text color="red.500" fontSize="sm">
                      {error}
                    </Text>
                  )}
                </VStack>
              </Box>

              <Button
                type="submit"
                maxW="400px"
                w="full"
                variant="outline"
                borderColor="blue.300"
                color="blue.300"
                borderRadius="lg"
                h="52px"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Challenge"}
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Suspense>
  );
}
