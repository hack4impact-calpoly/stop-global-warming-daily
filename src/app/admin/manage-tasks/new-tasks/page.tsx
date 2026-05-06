"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { Box, Text, VStack, HStack, Input, Textarea, Button } from "@chakra-ui/react";
import { LuChevronLeft, LuCheck } from "react-icons/lu";

const AVAILABLE_TAGS = [
  { label: "Shopping", color: "blue.400" },
  { label: "Sustainable Food", color: "yellow.500" },
  { label: "Waste Reduction", color: "orange.400" },
  { label: "Energy Saving", color: "teal.400" },
  { label: "Transportation", color: "purple.400" },
  { label: "Water Conservation", color: "cyan.400" },
  { label: "Community", color: "green.400" },
];

const AVAILABLE_IN = ["Daily Tasks", "Spring Challenge", "SLO Challenge"];

export default function NewTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [availableIn, setAvailableIn] = useState<string[]>([]);

  const visibleTags = showAllTags ? AVAILABLE_TAGS : AVAILABLE_TAGS.slice(0, 5);
  const hiddenCount = AVAILABLE_TAGS.length - 5;

  const toggleTag = (label: string) => {
    setSelectedTags((prev) => (prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]));
  };

  const toggleAvailableIn = (label: string) => {
    setAvailableIn((prev) => (prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]));
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" bg="gray.50">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="120px">
        <VStack align="stretch" gap={6}>
          {/* Header */}
          <HStack gap={3}>
            <Link href="/admin/manage-tasks" style={{ display: "flex", alignItems: "center" }}>
              <LuChevronLeft size={28} />
            </Link>
            <Text fontWeight="semibold" fontSize="4xl">
              New Task
            </Text>
          </HStack>

          {/* Form Card */}
          <Box bg="white" borderRadius="xl" p={4} shadow="sm">
            <VStack align="stretch" gap={5}>
              {/* Task Name */}
              <VStack align="stretch" gap={1}>
                <Text fontWeight="semibold" fontSize="sm">
                  Task Name
                </Text>
                <Input
                  placeholder="Name your task..."
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  bg="gray.100"
                  border="none"
                  borderRadius="lg"
                />
              </VStack>

              {/* Task Description */}
              <VStack align="stretch" gap={1}>
                <Text fontWeight="semibold" fontSize="sm">
                  Task Description
                </Text>
                <Textarea
                  placeholder="Describe your task..."
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

              {/* Available In */}
              <VStack align="stretch" gap={2}>
                <Text fontWeight="semibold" fontSize="sm">
                  Available in
                </Text>
                <HStack flexWrap="wrap" gap={3}>
                  {AVAILABLE_IN.map((option) => (
                    <HStack key={option} gap={2} cursor="pointer" onClick={() => toggleAvailableIn(option)}>
                      <Box
                        w="18px"
                        h="18px"
                        borderRadius="sm"
                        border="2px"
                        borderColor="gray.400"
                        bg={availableIn.includes(option) ? "gray.400" : "white"}
                      />
                      <Text fontSize="sm">{option}</Text>
                    </HStack>
                  ))}
                </HStack>
              </VStack>
            </VStack>
          </Box>
          <Button
            maxW="400px"
            w="full"
            variant="outline"
            borderColor="blue.300"
            color="blue.300"
            borderRadius="lg"
            h="52px"
          >
            Save Task
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
