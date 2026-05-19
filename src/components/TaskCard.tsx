import React from "react";
import BoxedDate from "./BoxedDate";
import Divider from "./Divider";
import CompeletionIndicator from "./CompletionIndicator";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";

interface TaskCardProps {
  date: Date; // Date for the task
  title: String; // Title of the task
  description: String; // Brief description for the task
  minEstimate: Number; // Estimated number of minutes to complete the task
  completed: boolean; // Has the task been marked as completed or not
  tags?: string[];
}

const getTagStyles = (tag: string) => {
  switch (tag) {
    case "Nature Preservation & Restoration":
      return {
        bg: "#E8F7EC",
        color: "#2F7A46",
        borderColor: "#59BB67",
      };
    case "Transportation":
      return {
        bg: "#F3ECFF",
        color: "#7B47C9",
        borderColor: "#C974F6",
      };
    case "Sustainable Food":
      return {
        bg: "#FFF7DB",
        color: "#8C6500",
        borderColor: "#E6A43B",
      };
    case "Waste Reduction":
      return {
        bg: "#FFF0E5",
        color: "#A65A1B",
        borderColor: "#E39B61",
      };
    case "Energy Saving":
      return {
        bg: "#E3F8F6",
        color: "#24837D",
        borderColor: "#43C9C1",
      };
    case "Shopping":
      return {
        bg: "#EAF3FF",
        color: "#3B6FB6",
        borderColor: "#7EB2F0",
      };
    case "Community/Volunteering":
      return {
        bg: "#FDEAF4",
        color: "#A64D7B",
        borderColor: "#F27AB6",
      };
    default:
      return {
        bg: "#EEF2F6",
        color: "#4A5568",
        borderColor: "#CBD5E0",
      };
  }
};

export default function TaskCard({ date, title, description, minEstimate, completed, tags = [] }: TaskCardProps) {
  const primaryTag = tags[0];
  const tagStyles = primaryTag ? getTagStyles(primaryTag) : null;

  return (
    <VStack
      bg="white"
      p={4}
      borderRadius="16px"
      w="100%"
      gap={0}
      align="stretch"
      minH="138px"
      boxShadow={"0px 1px 8px rgba(89, 91, 98, 0.1)"}
    >
      {/* Header */}
      <HStack align="stretch" gap={3}>
        <BoxedDate date={date} />
        <VStack align="flex-start" gap={1} flex={1} justify="center">
          <HStack align="flex-start" justify="space-between" w="100%">
            <VStack align="flex-start" gap={1} flex={1}>
              <Text fontSize="lg" fontWeight="bold" lineHeight="1.1">
                {title}
              </Text>

              <Box minH="28px" display="flex" alignItems="center">
                {primaryTag && tagStyles && (
                  <Box
                    px={3}
                    py="5px"
                    borderRadius="full"
                    border="1px solid"
                    bg={tagStyles.bg}
                    color={tagStyles.color}
                    borderColor={tagStyles.borderColor}
                  >
                    <Text fontSize="xs" fontWeight="medium" lineHeight="1">
                      {primaryTag}
                    </Text>
                  </Box>
                )}
              </Box>

              <Divider>
                <Text fontSize="sm">{`~${minEstimate} min`}</Text>
                <CompeletionIndicator completed={completed} />
              </Divider>
            </VStack>
          </HStack>

          <Text
            fontSize="sm"
            minH="40px"
            w="100%"
            overflow="hidden"
            css={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical" }}
          >
            {description}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
