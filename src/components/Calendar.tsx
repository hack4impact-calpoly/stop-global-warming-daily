import * as React from "react";
import { Box, Grid, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { IoMdCheckmark } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Calendar() {
  // Letters shown at the top of the calendar
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  // Fake calendar data for now
  const calendarDays = [
    { label: "28", category: "outsideMonth" as DayCategory },
    { label: "29", category: "outsideMonth" as DayCategory },
    { label: "30", category: "outsideMonth" as DayCategory },
    { label: "31", category: "outsideMonth" as DayCategory },
    { label: "1", category: "completed" as DayCategory },
    { label: "2", category: "completed" as DayCategory },
    { label: "3", category: "completed" as DayCategory },
    { label: "4", category: "completed" as DayCategory },
    { label: "5", category: "current" as DayCategory },
    { label: "6", category: "futureOrUncompleted" as DayCategory },
    { label: "7", category: "futureOrUncompleted" as DayCategory },
    { label: "8", category: "futureOrUncompleted" as DayCategory },
    { label: "9", category: "futureOrUncompleted" as DayCategory },
    { label: "10", category: "futureOrUncompleted" as DayCategory },
    { label: "11", category: "futureOrUncompleted" as DayCategory },
    { label: "12", category: "futureOrUncompleted" as DayCategory },
    { label: "13", category: "futureOrUncompleted" as DayCategory },
    { label: "14", category: "futureOrUncompleted" as DayCategory },
    { label: "15", category: "futureOrUncompleted" as DayCategory },
    { label: "16", category: "futureOrUncompleted" as DayCategory },
    { label: "17", category: "futureOrUncompleted" as DayCategory },
    { label: "18", category: "futureOrUncompleted" as DayCategory },
    { label: "19", category: "futureOrUncompleted" as DayCategory },
    { label: "20", category: "futureOrUncompleted" as DayCategory },
    { label: "21", category: "futureOrUncompleted" as DayCategory },
    { label: "22", category: "futureOrUncompleted" as DayCategory },
    { label: "23", category: "futureOrUncompleted" as DayCategory },
    { label: "24", category: "futureOrUncompleted" as DayCategory },
    { label: "25", category: "futureOrUncompleted" as DayCategory },
    { label: "26", category: "futureOrUncompleted" as DayCategory },
    { label: "27", category: "futureOrUncompleted" as DayCategory },
    { label: "28", category: "futureOrUncompleted" as DayCategory },
    { label: "1", category: "outsideMonth" as DayCategory },
    { label: "2", category: "outsideMonth" as DayCategory },
    { label: "3", category: "outsideMonth" as DayCategory },
  ];
  return (
    <VStack maxW="345px" w="full" align="stretch" gap={0}>
      {/* Top row with month on left and arrows on the right */}
      <HStack w={"full"} h={"29px"} justify="space-between" align="center">
        <Text fontSize="24px" fontWeight="semibold" color="black">
          January
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
      {/* Wrapper for weekday row and day grid */}
      <Box>
        {/* Weekday labels */}
        <Grid w="full" templateColumns="repeat(7, 1fr)" gap={1}>
          {weekDays.map((day, index) => (
            <Box display="flex" key={index} w={"46px"} h={"46px"} justifyContent={"center"} alignItems={"center"}>
              <Text fontSize="10px" fontWeight="medium" color="black">
                {day}
              </Text>
            </Box>
          ))}
        </Grid>
        {/* Calendar day grid */}
        <Grid w="full" templateColumns="repeat(7, 1fr)" gap={1}>
          {calendarDays.map((day, index) => (
            <CalendarDay key={index} label={day.label} category={day.category} />
          ))}
        </Grid>
      </Box>
    </VStack>
  );
}

type DayCategory = "current" | "futureOrUncompleted" | "completed" | "outsideMonth";
type CalendarDayProps = {
  label: string;
  category: DayCategory;
};
//Day cell for calendar component to use
function CalendarDay({ label, category }: CalendarDayProps) {
  // Picked colors based on the type of day
  const styles = getDayStyles(category);
  return (
    <Box
      display="flex"
      w={"46px"}
      h={"46px"}
      borderRadius={"full"}
      justifyContent={"center"}
      alignItems={"center"}
      border=".72px solid"
      borderColor="#D5D4DF"
      {...styles}
    >
      {/* Show checkmark if completed if not then  show the day number */}
      {category == "completed" ? <IoMdCheckmark color="#000000" /> : <Text fontSize={"10px"}>{label}</Text>}
    </Box>
  );
}
// Styles based on how each day should look based on its type
const getDayStyles = (category: DayCategory) => {
  switch (category) {
    case "current":
      return {
        bg: "#696969",
        color: "white",
      };
    case "completed":
      return {
        bg: "#7DFF66",
        color: "white",
      };
    case "futureOrUncompleted":
      return {
        bg: "white",
        color: "gray.800",
      };
    case "outsideMonth":
      return {
        bg: "#F2F3F7",
        color: "#A8A8A8",
      };
  }
};
