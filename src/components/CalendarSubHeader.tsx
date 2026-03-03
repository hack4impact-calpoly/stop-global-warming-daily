import { Text, HStack, IconButton } from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type CalendarSubHeaderProps = {
  date: string;
  onPrevious?: () => void;
  onNext?: () => void;
};

export default function CalendarSubHeader({ date, onPrevious, onNext }: CalendarSubHeaderProps) {
  return (
    <HStack w={"full"} h={"29px"} justify="space-between" align="center">
      <Text fontSize="24px" fontWeight="semibold" color="black">
        {date}
      </Text>
      <HStack gap={2}>
        <IconButton variant="ghost" size={"xs"} onClick={onPrevious}>
          <FaChevronLeft />
        </IconButton>

        <IconButton variant="ghost" size={"xs"} onClick={onNext}>
          <FaChevronRight />
        </IconButton>
      </HStack>
    </HStack>
  );
}
