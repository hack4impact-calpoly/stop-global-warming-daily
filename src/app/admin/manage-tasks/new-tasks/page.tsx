"use client";

import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Text, VStack, HStack, Input, Textarea, Button } from "@chakra-ui/react";
import { LuChevronLeft, LuCheck } from "react-icons/lu";

type AvailableTag = {
  label: string;
  color: string;
};

type TaskFormResponse = {
  _id?: string;
  title?: string;
  description?: string;
  time?: number;
  tags?: string[];
  error?: string;
};

type TimeValidationResult =
  | {
      isValid: true;
      totalMinutes: number;
    }
  | {
      isValid: false;
      error: string;
    };

const AVAILABLE_TAGS: AvailableTag[] = [
  { label: "Shopping", color: "blue.400" },
  { label: "Sustainable Food", color: "yellow.500" },
  { label: "Waste Reduction", color: "orange.400" },
  { label: "Energy Saving", color: "teal.400" },
  { label: "Transportation", color: "purple.400" },
  { label: "Community/Volunteering", color: "green.400" },
  { label: "Nature Preservation & Restoration", color: "green.500" },
];

function NewTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const isEditMode = Boolean(taskId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visibleTags = showAllTags ? AVAILABLE_TAGS : AVAILABLE_TAGS.slice(0, 5);
  const hiddenCount = AVAILABLE_TAGS.length - 5;

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      setError("");

      try {
        const response = await fetch(`/api/task/${taskId}`, {
          cache: "no-store",
        });

        const data: TaskFormResponse | null = await response.json().catch(() => null);

        if (!response.ok || !data) {
          throw new Error(data?.error ?? "Failed to load task.");
        }

        const totalMinutes = typeof data.time === "number" ? data.time : 0;

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setSelectedTags(Array.isArray(data.tags) ? data.tags : []);
        setHours(String(Math.floor(totalMinutes / 60)));
        setMinutes(String(totalMinutes % 60));
        setShowAllTags(true);
      } catch (fetchError) {
        console.error("Failed to load task:", fetchError);
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load task.");
      }
    };

    fetchTask();
  }, [taskId]);

  const toggleTag = (label: string) => {
    setSelectedTags((prev) => (prev.includes(label) ? prev.filter((tag) => tag !== label) : [...prev, label]));
  };

  const handleWholeNumberChange = (value: string, setter: (value: string) => void, max?: number) => {
    if (!/^\d*$/.test(value)) return;

    if (value !== "" && max !== undefined && Number(value) > max) {
      return;
    }

    setter(value);
    setError("");
  };

  const getValidatedTotalMinutes = (): TimeValidationResult => {
    const parsedHours = hours === "" ? 0 : Number(hours);
    const parsedMinutes = minutes === "" ? 0 : Number(minutes);

    if (!Number.isInteger(parsedHours) || parsedHours < 0) {
      return {
        isValid: false,
        error: "Hours must be a whole number greater than or equal to 0.",
      };
    }

    if (!Number.isInteger(parsedMinutes) || parsedMinutes < 0 || parsedMinutes > 59) {
      return {
        isValid: false,
        error: "Minutes must be a whole number between 0 and 59.",
      };
    }

    const totalMinutes = parsedHours * 60 + parsedMinutes;

    if (totalMinutes <= 0) {
      return {
        isValid: false,
        error: "Time to complete must be greater than 0 minutes.",
      };
    }

    return {
      isValid: true,
      totalMinutes,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Task name is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Task description is required.");
      return;
    }

    const timeResult = getValidatedTotalMinutes();

    if (!timeResult.isValid) {
      setError(timeResult.error);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(isEditMode && taskId ? `/api/task/${taskId}` : "/api/task", {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          description: trimmedDescription,
          time: timeResult.totalMinutes,
          tags: selectedTags,
        }),
      });

      const data: TaskFormResponse | null = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? `Failed to ${isEditMode ? "update" : "create"} task.`);
      }

      router.push("/admin/manage-tasks");
      router.refresh();
    } catch (submitError) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} task:`, submitError);
      setError(
        submitError instanceof Error ? submitError.message : `Failed to ${isEditMode ? "update" : "create"} task.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" bg="gray.50">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="120px">
        <form onSubmit={handleSubmit}>
          <VStack align="stretch" gap={6}>
            <HStack gap={3}>
              <Link href="/admin/manage-tasks" style={{ display: "flex", alignItems: "center" }}>
                <LuChevronLeft size={28} />
              </Link>
              <Text fontWeight="semibold" fontSize="4xl">
                {isEditMode ? "Edit Task" : "New Task"}
              </Text>
            </HStack>

            <Box bg="white" borderRadius="xl" p={4} shadow="sm">
              <VStack align="stretch" gap={5}>
                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Task Name
                  </Text>
                  <Input
                    placeholder="Name your task..."
                    value={title}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setTitle(event.target.value);
                      setError("");
                    }}
                    bg="gray.100"
                    border="none"
                    borderRadius="lg"
                  />
                </VStack>

                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Task Description
                  </Text>
                  <Textarea
                    placeholder="Describe your task..."
                    value={description}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                      setDescription(event.target.value);
                      setError("");
                    }}
                    bg="gray.100"
                    border="none"
                    borderRadius="lg"
                    resize="none"
                    rows={4}
                  />
                </VStack>

                <VStack align="stretch" gap={2}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Add Tags
                  </Text>
                  <HStack flexWrap="wrap" gap={2}>
                    {visibleTags.map((tag: AvailableTag) => {
                      const selected = selectedTags.includes(tag.label);

                      return (
                        <Button
                          key={tag.label}
                          type="button"
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
                        type="button"
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

                <VStack align="stretch" gap={2}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Time to Complete
                  </Text>
                  <HStack gap={2}>
                    <Input
                      type="number"
                      inputMode="numeric"
                      step={1}
                      value={hours}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleWholeNumberChange(event.target.value, setHours)
                      }
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
                      inputMode="numeric"
                      step={1}
                      value={minutes}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleWholeNumberChange(event.target.value, setMinutes, 59)
                      }
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Task"}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={null}>
      <NewTaskForm />
    </Suspense>
  );
}
