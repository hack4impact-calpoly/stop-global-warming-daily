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
      alignSelf="stretch"
      justify="center"
      bg="#E5E9F9"
      borderRadius="12px"
      fontWeight="bold"
      minW="46px"
      lineHeight={1}
    >
      <Text fontSize="sm">{dayAbbr}</Text>
      <Text fontSize="36px">{dayNum}</Text>
    </VStack>
  );
}
