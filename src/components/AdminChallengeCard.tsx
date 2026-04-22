import { Collapsible, HStack, IconButton, Menu, Portal, Text, VStack } from "@chakra-ui/react";
import { LuEllipsisVertical } from "react-icons/lu";

interface AdminChallengeCardProps {
  title: string;
  description: string;
  isActive: boolean;
}

export default function AdminChallengeCard({ title, description, isActive }: AdminChallengeCardProps) {
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
        {/* Header */}
        <HStack h="100%" w="100%" align="flex-start" gap={2}>
          <Collapsible.Trigger transition="transform 0.2s" flex="1" w="100%">
            <VStack align="flex-start" gap={0} w="100%">
              <Text fontSize="lg" fontWeight="semibold">
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
                  <Menu.Item value="edit-challenge">Edit</Menu.Item>
                  <Menu.Item value="delete-challenge">Delete</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
        {/* Full Description */}
        <Collapsible.Content>
          <Text color="gray.600" fontSize="sm" pt={3}>
            {description}
          </Text>
        </Collapsible.Content>
      </VStack>
    </Collapsible.Root>
  );
}
