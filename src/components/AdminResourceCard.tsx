"use client";

import { Box, HStack, IconButton, Menu, Portal, Tag, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuEllipsisVertical } from "react-icons/lu";

interface AdminResourceCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  link: string;
  tags: string[];
  onDelete: (resourceId: string) => Promise<void>;
}

export default function AdminResourceCard({
  id,
  title,
  description,
  location,
  link,
  tags,
  onDelete,
}: AdminResourceCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/manage-resources/new-resource?resourceId=${id}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);

    if (!confirmed) return;

    try {
      await onDelete(id);
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert("Failed to delete resource. Please try again.");
    }
  };

  return (
    <Box bg="white" borderRadius="xl" p={4} shadow="sm" w="100%">
      <HStack align="flex-start" justify="space-between" gap={3} w="100%">
        <VStack align="stretch" gap={2} flex={1} minW={0}>
          <Text
            fontWeight="bold"
            fontSize="lg"
            w="100%"
            textAlign="left"
            whiteSpace="normal"
            overflowWrap="anywhere"
            wordBreak="break-word"
            lineHeight="1.25"
          >
            {title}
          </Text>

          <Text fontSize="sm" color="gray.700">
            {description}
          </Text>

          <Text fontSize="sm" color="gray.600">
            {location}
          </Text>

          {tags.length > 0 && (
            <HStack gap={2} flexWrap="wrap">
              {tags.map((tag) => (
                <Tag.Root key={tag} size="sm" borderRadius="full">
                  <Tag.Label>{tag}</Tag.Label>
                </Tag.Root>
              ))}
            </HStack>
          )}

          {link && (
            <Text fontSize="sm" color="blue.500" overflow="hidden" textOverflow="ellipsis">
              {link}
            </Text>
          )}
        </VStack>

        <Menu.Root>
          <Menu.Trigger asChild>
            <IconButton aria-label={`Open actions for ${title}`} variant="ghost" size="sm" flexShrink={0}>
              <LuEllipsisVertical size="24px" />
            </IconButton>
          </Menu.Trigger>

          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="edit-resource" onClick={handleEdit}>
                  Edit
                </Menu.Item>
                <Menu.Item value="delete-resource" onClick={handleDelete}>
                  Delete
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>
    </Box>
  );
}
