import React from "react";
import BoxedDate from "./BoxedDate";
import Divider from "./Divider";
import CompeletionIndicator from "./CompletionIndicator";
import { Box, HStack, Text, VStack, Collapsible } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
interface TaskCardProps {
  date: Date; // Date for the task
  title: String; // Title of the task
  description: String; // Brief description for the task
  minEstimate: Number; // Estimated number of minutes to complete the task
  completed: boolean; // Has the task been marked as completed or not
}

export default function TaskCard({ date, title, description, minEstimate, completed }: TaskCardProps) {
  return (
    <Collapsible.Root>
      <VStack
        bg="white"
        p={3}
        borderRadius="lg"
        w="100%"
        gap={0}
        align="stretch"
        boxShadow={"0px 1px 8px rgba(89, 91, 98, 0.1)"}
      >
        {/* Header */}
        <HStack align="flex-start" gap={4}>
          <BoxedDate date={date} />
          <VStack align="flex-start" gap={0} flex={1}>
            <HStack align="flex-start" justify="space-between" w="100%">
              <VStack align="flex-start" gap={0}>
                <Text fontSize="lg" fontWeight="bold">
                  {title}
                </Text>
                <Divider>
                  <Text fontSize="sm">{`~${minEstimate} min`}</Text>
                  <CompeletionIndicator completed={completed} />
                </Divider>
              </VStack>
              <Collapsible.Trigger _open={{ transform: "rotate(90deg)" }} transition="transform 0.2s">
                <LuChevronRight size="15px" />
              </Collapsible.Trigger>
            </HStack>
            <Text
              fontSize="sm"
              w="100%"
              overflow="hidden"
              css={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical" }}
            >
              {description}
            </Text>
          </VStack>
        </HStack>
        {/* Full Description */}
        <Collapsible.Content>
          <VStack align="flex-start" gap={2} pt={3}>
            <VStack align="flex-start" gap={1}>
              <Text fontSize="sm" fontWeight="bold">
                Why this task matters:
              </Text>
              <Text fontSize="sm">Doing this task can lower your carbon footprint by X%.</Text>
            </VStack>
          </VStack>
        </Collapsible.Content>
      </VStack>
    </Collapsible.Root>
  );
}
