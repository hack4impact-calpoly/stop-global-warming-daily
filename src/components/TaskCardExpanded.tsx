import React from "react";
import Divider from "./Divider";
import CompeletionIndicator from "./CompletionIndicator";
import { Button, Tag, Text, VStack } from "@chakra-ui/react";

interface TaskCardExpandedProps {
  title: String; // Title of the task
  category: String; // Category tag
  minEstimate: Number; // Estimated number of minutes to complete the task
  completed: boolean; // Has the task been marked as completed or not
  description: String; // Brief description for the task
  onComplete?: () => void;
  buttonLabel?: string;
  buttonDisabled?: boolean;
}

export default function TaskCardExpanded({
  title,
  category,
  minEstimate,
  completed,
  description,
  onComplete,
  buttonLabel = "Complete",
  buttonDisabled = false,
}: TaskCardExpandedProps) {
  return (
    <VStack
      bg="white"
      p={4}
      borderRadius="16px"
      w="100%"
      gap={0}
      align="stretch"
      boxShadow="0px 1px 8px rgba(89, 91, 98, 0.1)"
    >
      <VStack align="flex-start" gap={4} flex={1}>
        <VStack align="flex-start" gap={2} w="100%">
          {/* Title */}
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>

          {/* Category tag */}
          <Tag.Root size="sm" bg="#43C9C1" borderRadius="999px" variant="solid" px="10px" py="4px">
            <Tag.Label color="#3B3B3B" fontWeight="semibold">
              {category}
            </Tag.Label>
          </Tag.Root>

          {/* Completion indicator */}
          <Divider>
            <Text fontSize="sm">{`~${minEstimate} min`}</Text>
            <CompeletionIndicator completed={completed} />
          </Divider>

          {/* Description */}
          <Text
            fontSize="sm"
            w="100%"
            overflow="hidden"
            css={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical" }}
          >
            {description}
          </Text>
        </VStack>

        {/* Completed button placeholder*/}
        <Button
          w="100%"
          borderRadius="12px"
          bg="#64B9FF"
          color="white"
          fontWeight="bold"
          fontSize="md"
          px="25px"
          py="20px"
          onClick={onComplete}
          disabled={buttonDisabled}
        >
          {buttonLabel}
        </Button>
      </VStack>
    </VStack>
  );
}
