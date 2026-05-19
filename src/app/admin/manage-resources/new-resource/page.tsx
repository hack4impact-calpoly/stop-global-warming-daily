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

type ResourceFormResponse = {
  _id?: string;
  title?: string;
  description?: string;
  location?: string;
  link?: string;
  tags?: string[];
  error?: string;
};

const AVAILABLE_TAGS: AvailableTag[] = [
  { label: "Shopping", color: "blue.400" },
  { label: "Sustainable Food", color: "yellow.500" },
  { label: "Waste Reduction", color: "orange.400" },
  { label: "Energy Saving", color: "teal.400" },
  { label: "Transportation", color: "purple.400" },
  { label: "Community/Volunteering", color: "green.400" },
  { label: "Nature Preservation & Restoration", color: "cyan.400" },
];

function NewResourceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const resourceId = searchParams.get("resourceId");
  const isEditMode = Boolean(resourceId);

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

  useEffect(() => {
    if (!resourceId) return;

    const fetchResource = async () => {
      setError("");

      try {
        const response = await fetch(`/api/resource/${resourceId}`, {
          cache: "no-store",
        });

        const data: ResourceFormResponse | null = await response.json().catch(() => null);

        if (!response.ok || !data) {
          throw new Error(data?.error ?? "Failed to load resource.");
        }

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setLocation(data.location ?? "");
        setLink(data.link ?? "");
        setSelectedTags(Array.isArray(data.tags) ? data.tags : []);
        setShowAllTags(true);
      } catch (fetchError) {
        console.error("Failed to load resource:", fetchError);
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load resource.");
      }
    };

    fetchResource();
  }, [resourceId]);

  const toggleTag = (label: string) => {
    setSelectedTags((prev) => (prev.includes(label) ? prev.filter((tag) => tag !== label) : [...prev, label]));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Resource name is required.");
      return;
    }

    if (!description.trim()) {
      setError("Resource description is required.");
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

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(isEditMode && resourceId ? `/api/resource/${resourceId}` : "/api/resource", {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          link: link.trim(),
          tags: selectedTags,
        }),
      });

      const data: ResourceFormResponse | null = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? `Failed to ${isEditMode ? "update" : "create"} resource.`);
      }

      router.push("/admin/manage-resources");
      router.refresh();
    } catch (saveError) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} resource:`, saveError);
      setError(
        saveError instanceof Error ? saveError.message : `Failed to ${isEditMode ? "update" : "create"} resource.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" minH="100vh" bg="gray.50">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb="120px">
        <form onSubmit={handleSave}>
          <VStack align="stretch" gap={6}>
            <HStack gap={3}>
              <Link href="/admin/manage-resources" style={{ display: "flex", alignItems: "center" }}>
                <LuChevronLeft size={28} />
              </Link>
              <Text fontWeight="semibold" fontSize="4xl">
                {isEditMode ? "Edit Resource" : "New Resource"}
              </Text>
            </HStack>

            <Box bg="white" borderRadius="xl" p={4} shadow="sm">
              <VStack align="stretch" gap={5}>
                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Resource Name
                  </Text>
                  <Input
                    placeholder="Name your resource..."
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
                    Resource Description
                  </Text>
                  <Textarea
                    placeholder="Describe your resource..."
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

                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Location
                  </Text>
                  <Input
                    placeholder="Where is this resource located?"
                    value={location}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setLocation(event.target.value);
                      setError("");
                    }}
                    bg="gray.100"
                    border="none"
                    borderRadius="lg"
                  />
                </VStack>

                <VStack align="stretch" gap={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    Link
                  </Text>
                  <Input
                    placeholder="Add a link..."
                    value={link}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setLink(event.target.value);
                      setError("");
                    }}
                    bg="gray.100"
                    border="none"
                    borderRadius="lg"
                  />
                </VStack>

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
              {isSaving ? "Saving..." : "Save Resource"}
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default function NewResourcePage() {
  return (
    <Suspense fallback={null}>
      <NewResourceForm />
    </Suspense>
  );
}
