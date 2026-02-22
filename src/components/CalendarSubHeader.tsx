import { Box, VStack, Text, HStack, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type CalendarSubHeaderProps = {
  date: string;
};

export default function CalendarSubHeader({ date }: CalendarSubHeaderProps) {
  return (
    <HStack w={"full"} h={"29px"} justify="space-between" align="center">
      <Text fontSize="24px" fontWeight="semibold" color="black">
        {date}
      </Text>
      <HStack gap={2}>
        <IconButton variant="ghost" size={"xs"}>
          <FaChevronLeft />
        </IconButton>

        <IconButton variant="ghost" size={"xs"}>
          <FaChevronRight />
        </IconButton>
      </HStack>
    </HStack>
  );
}
