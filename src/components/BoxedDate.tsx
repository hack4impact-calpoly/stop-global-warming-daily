import React from "react";
import { Text, VStack } from "@chakra-ui/react";

interface BoxedDateProps {
  date: Date;
}

export default function BoxedDate({ date }: BoxedDateProps) {
  const dayAbbr = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dayNum = date.getDate();

  return (
    <VStack
      align="center"
      justify="center"
      bg="#E5EDF7"
      borderRadius="12px"
      fontWeight="bold"
      minW="68px"
      minH="92px"
      gap={1}
      flexShrink={0}
      lineHeight={1}
    >
      <Text fontSize="sm" lineHeight="1">
        {dayAbbr}
      </Text>
      <Text fontSize="36px" lineHeight="1">
        {dayNum}
      </Text>
    </VStack>
  );
}
