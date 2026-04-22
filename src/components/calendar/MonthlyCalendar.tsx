import * as React from "react";
import { Box, Grid, Text, VStack } from "@chakra-ui/react";
import { IoMdCheckmark } from "react-icons/io";
import type { CalendarDay, DayCategory } from "@/data/dummyMonthData";

interface MonthlyCalendarProps {
  days: CalendarDay[];
}
export default function MonthlyCalendar({ days }: MonthlyCalendarProps) {
  // Letters shown at the top of the calendar
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <VStack w="full" align="stretch" gap={0}>
      {/* Wrapper for weekday row and day grid */}
      <Box>
        {/* Weekday labels */}
        <Grid w="full" templateColumns="repeat(7, 1fr)" gap={1}>
          {weekDays.map((day, index) => (
            <Box key={index} display="flex" w="full" aspectRatio={1} justifyContent={"center"} alignItems={"center"}>
              <Text fontSize="10px" fontWeight="medium" color="black">
                {day}
              </Text>
            </Box>
          ))}
        </Grid>
        {/* Calendar day grid */}
        <Grid w="full" templateColumns="repeat(7, 1fr)" gap={1}>
          {days.map((day, index) => (
            <CalendarDayCell key={index} label={day.label} category={day.category} />
          ))}
        </Grid>
      </Box>
    </VStack>
  );
}

type CalendarDayCellProps = {
  label: string;
  category: DayCategory;
};
//Day cell for calendar component to use
function CalendarDayCell({ label, category }: CalendarDayCellProps) {
  // Picked colors based on the type of day
  const styles = getDayStyles(category);
  return (
    <Box
      display="flex"
      aspectRatio={1}
      w="full"
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
        bg: "#4A4B54",
      };
    case "completed":
      return {
        bg: "#ADEA9E",
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
        color: "#A9AEB1",
      };
  }
};
