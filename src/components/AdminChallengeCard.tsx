"use client";
import { Collapsible, HStack, IconButton, Menu, Portal, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LuEllipsisVertical } from "react-icons/lu";

interface AdminChallengeCardProps {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  onDelete: (id: string) => Promise<void>;
}

export default function AdminChallengeCard({ id, title, description, isActive, onDelete }: AdminChallengeCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/manage-challenges/new-challenge?challengeId=${id}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Failed to delete challenge:", error);
      alert("Failed to delete challenge. Please try again.");
    }
  };

  return (
    <Collapsible.Root>
      <VStack
        bg="white"
        p={"30px 12px"}
        borderRadius="lg"
        w="100%"
        gap={0}
        align="stretch"
        boxShadow={"0px 1px 8px rgba(89, 91, 98, 0.1)"}
      >
        <HStack h="100%" w="100%" align="flex-start" gap={2}>
          <Collapsible.Trigger transition="transform 0.2s" flex="1" minW={0} w="100%" textAlign="left">
            <VStack align="flex-start" gap={0} minW={0} w="100%">
              <Text
                fontSize="lg"
                fontWeight="semibold"
                w="100%"
                textAlign="left"
                whiteSpace="normal"
                overflowWrap="anywhere"
                wordBreak="break-word"
                lineHeight="1.25"
              >
                {title}
              </Text>
              <Text fontSize="sm" color={isActive ? "#ADEA9E" : "#EA9E9E"}>
                {isActive ? "Active" : "Inactive"}
              </Text>
              <Text
                fontSize="sm"
                w="100%"
                textAlign={"start"}
                color="gray.600"
                css={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical" }}
              >
                {description}
              </Text>
            </VStack>
          </Collapsible.Trigger>

          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                aria-label={`Open actions for ${title}`}
                variant="ghost"
                size="sm"
                alignSelf="flex-start"
                flexShrink={0}
                mt={1}
                ml="auto"
              >
                <LuEllipsisVertical size="24px" />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="edit-challenge" onClick={handleEdit}>
                    Edit
                  </Menu.Item>
                  <Menu.Item value="delete-challenge" onClick={handleDelete}>
                    Delete
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>

        <Collapsible.Content>
          <Text color="gray.600" fontSize="sm" pt={3}>
            {description}
          </Text>
        </Collapsible.Content>
      </VStack>
    </Collapsible.Root>
  );
}
