import { HStack, Text, VStack, Collapsible, Menu, Portal, IconButton, Box } from "@chakra-ui/react";
import { LuEllipsisVertical } from "react-icons/lu";

interface AdminChallengeCardProps {
  title: String; // Title of the challenge
  description: String; // Description for the challenge
  isActive: boolean; // flag to indicate if challange is active
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
        <HStack h="100%" w="100%" align="flex-start" gap={0} alignItems={"flex-start"}>
          <Collapsible.Trigger transition="transform 0.2s">
            <VStack align="flex-start" gap={0} flex={1}>
              <HStack align="flex-start" justify="space-between" w="100%">
                <VStack align="flex-start" gap={0}>
                  <Text fontSize="lg" fontWeight="semibold">
                    {title}
                  </Text>
                  <Text fontSize="sm" color={isActive ? "#ADEA9E" : "#EA9E9E"}>
                    {isActive ? "Active" : "Inactive"}
                  </Text>
                </VStack>
              </HStack>
              <Text
                fontSize="sm"
                w="100%"
                textAlign={"start"}
                css={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical" }}
              >
                {description}
              </Text>
            </VStack>
          </Collapsible.Trigger>
          <Menu.Root>
            <Menu.Trigger asChild>
              <Box mt={"30px"}>
                <LuEllipsisVertical size="24px" />
              </Box>
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
        <Collapsible.Content></Collapsible.Content>
      </VStack>
    </Collapsible.Root>
  );
}
