import React from "react";
import Divider from "./Divider";
import CompeletionIndicator from "./CompletionIndicator";
import { Box, Button, Image, Tag, Text, VStack } from "@chakra-ui/react";

interface TaskCardExpandedProps {
  title: String; // Title of the task
  category: String; // Category tag
  minEstimate: Number; // Estimated number of minutes to complete the task
  completed: boolean; // Has the task been marked as completed or not
  description: String; // Brief description for the task
}

export default function TaskCardExpanded({
  title,
  category,
  minEstimate,
  completed,
  description,
}: TaskCardExpandedProps) {
  return (
    <VStack
      bg="white"
      p={3}
      borderRadius="16px"
      w="100%"
      gap={0}
      align="stretch"
      boxShadow="0px 1px 8px 0px rgba(89, 91, 98, 0.10)"
    >
      <VStack align="flex-start" gap={4} flex={1}>
        <VStack align="flex-start" gap={2}>
          {/* Image placeholder */}
          <Box position="relative" w="100%" h="200px" borderRadius="md" overflow="hidden" bg="gray.300">
            <Image src="" alt="" w="100%" h="200px" borderRadius="md" objectFit="cover" />
          </Box>
          {/* Title */}
          <Text fontSize="lg" fontWeight="bold">
            {title}
          </Text>
          {/* Category tag */}
          <Tag.Root size="lg" bg={"#43C9C1"} borderRadius="6px" variant={"solid"} px={"10px"} py={"5px"}>
            <Tag.Label color={"#3B3B3B"} fontWeight="semibold">
              {category}
            </Tag.Label>
          </Tag.Root>
          {/* Completion indicator */}
          <Divider>
            <Text fontSize="sm">{`~${minEstimate} min`}</Text>
            <CompeletionIndicator completed={completed} />
          </Divider>
          {/* Description */}
          <Text fontSize="sm" w="100%">
            {description}
          </Text>
        </VStack>

        {/* More Text Descriptions placeholder*/}
        <VStack align="flex-start" gap={0}>
          <Text fontSize="sm" fontWeight="bold">
            Why this task matters:
          </Text>
          <Text fontSize="sm">Doing this task can lower your carbon footprint by X%.</Text>
        </VStack>
        <VStack align="flex-start" gap={0}>
          <Text fontSize="sm" fontWeight="bold">
            Tips for completing it:
          </Text>
          {["Tip #1", "Tip #2", "Tip #3"].map((tip, index) => (
            <Text key={index} fontSize="sm" lineHeight={1}>
              {`${index + 1}. ${tip}`}
            </Text>
          ))}
        </VStack>

        {/* Completed button placeholder*/}
        <Button borderRadius="full" bg="#64B9FF" color="black" fontWeight="bold" fontSize="lg" px={"25px"} py={"20px"}>
          Completed
        </Button>
      </VStack>
    </VStack>
  );
}
