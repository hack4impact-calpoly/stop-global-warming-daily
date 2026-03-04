import { Box, VStack, Text, HStack, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type CalendarSubHeaderProps = {
  date: string;
};

export default function CalendarSubHeader({ date }: CalendarSubHeaderProps) {
  return (
    <HStack w={"full"} h={"29px"} justify="space-between" align="center">
      <Text fontSize="2xl" fontWeight={"semibold"}>
        {date}
      </Text>
      <HStack gap={2}>
        <IconButton variant="ghost" size="md">
          <LuChevronLeft />
        </IconButton>

        <IconButton variant="ghost" size="md" justifyContent="flex-end">
          <LuChevronRight />
        </IconButton>
      </HStack>
    </HStack>
  );
}
