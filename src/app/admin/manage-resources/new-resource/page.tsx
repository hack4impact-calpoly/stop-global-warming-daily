"use client";

import { ChangeEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Text, VStack, HStack, Input, Textarea, Button } from "@chakra-ui/react";
import { LuChevronLeft, LuCheck } from "react-icons/lu";
import { IoMdReturnLeft } from "react-icons/io";

const AVAILABLE_TAGS = [
  { label: "Shopping", color: "blue.400" },
  { label: "Sustainable Food", color: "yellow.500" },
  { label: "Waste Reduction", color: "orange.400" },
  { label: "Energy Saving", color: "teal.400" },
  { label: "Transportation", color: "purple.400" },
  { label: "Community/Volunteering", color: "green.400" },
  { label: "Nature Preservation & Restoration", color: "cyan.400" },
];

export default function NewResourcePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const visibleTags = showAllTags ? AVAILABLE_TAGS : AVAILABLE_TAGS.slice(0, 5);
  const hiddenCount = AVAILABLE_TAGS.length - 5;

  const toggleTag = (label: string) => {
    setSelectedTags((prev) => (prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]));
  };

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !link.trim()) {
      if (!title.trim()) {
        setError("Resource name is required.");
        return;
      }

      if (!description.trim()) {
        setError("Task description is required.");
        return;
      }

      if (!location.trim()) {
        setError("Location is required.");
        return;
      }

      if (!link.trim()) {
        setError("Link is required.");
        return;
      }
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          link: link.trim(),
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create resource");
      }

      router.push("/admin/manage-resources");
    } catch (error) {
      console.error("Failed to save resource:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" bg="gray.50">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="120px">
        <VStack align="stretch" gap={6}>
          {/* Header */}
          <HStack gap={3}>
            <Link href="/admin/manage-resources" style={{ display: "flex", alignItems: "center" }}>
              <LuChevronLeft size={28} />
            </Link>
            <Text fontWeight="semibold" fontSize="4xl">
              New Resource
            </Text>
          </HStack>

          {/* Form Card */}
          <Box bg="white" borderRadius="xl" p={4} shadow="sm">
            <VStack align="stretch" gap={5}>
              {/* Resource Name */}
              <VStack align="stretch" gap={1}>
                <Text fontWeight="semibold" fontSize="sm">
                  Resource Name
                </Text>
                <Input
                  placeholder="Name your resource..."
                  value={title}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  bg="gray.100"
                  border="none"
                  borderRadius="lg"
                />
              </VStack>

              {/* Resource Description */}
              <VStack align="stretch" gap={1}>
                <Text fontWeight="semibold" fontSize="sm">
                  Resource Description
                </Text>
                <Textarea
                  placeholder="Describe your resource..."
                  value={description}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                  bg="gray.100"
                  border="none"
                  borderRadius="lg"
                  resize="none"
                  rows={4}
                />
              </VStack>

              {/* Location */}
              <VStack align="stretch" gap={1}>
                <Text fontWeight="semibold" fontSize="sm">
                  Location
                </Text>
                <Input
                  placeholder="Where is this resource located?"
                  value={location}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                  bg="gray.100"
                  border="none"
                  borderRadius="lg"
                />
              </VStack>

              {/* Link */}
              <VStack align="stretch" gap={1}>
                <Text fontWeight="semibold" fontSize="sm">
                  Link
                </Text>
                <Input
                  placeholder="Add a link..."
                  value={link}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
                  bg="gray.100"
                  border="none"
                  borderRadius="lg"
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
              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}
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
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Resource"}
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
