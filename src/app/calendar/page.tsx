"use client";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import React from "react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import CalendarSwitchButton from "@/components/CalendarSwitchButton";

export default function Page() {
  const [view, setView] = React.useState<"D" | "W" | "M">("M");

  const showCalendar = (selectCalendar: string) => {
    if (selectCalendar === "D")
      return (
        <>
          <CalendarSubHeader date="January 5th"></CalendarSubHeader>
          <Box></Box>
        </>
      );
    else if (selectCalendar === "W")
      return (
        <>
          <CalendarSubHeader date="January 4-10"></CalendarSubHeader>
          <Box></Box>
        </>
      );
    else
      return (
        <>
          <CalendarSubHeader date="January 2026"></CalendarSubHeader>
          <MonthlyCalendar></MonthlyCalendar>
        </>
      );
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <VStack maxW="345px" align="stretch" w="full" gap={2} px={3} py={3}>
        <HStack justify="space-between" align="center">
          <Text fontSize="34px" fontWeight="semibold" color="black">
            My Calendar
          </Text>
          <HStack bg="#E6E8F2" px={1} py={1} borderRadius="full" align="center">
            <CalendarSwitchButton label="D" selected={view === "D"} onClick={() => setView("D")} />
            <CalendarSwitchButton label="W" selected={view === "W"} onClick={() => setView("W")} />
            <CalendarSwitchButton label="M" selected={view === "M"} onClick={() => setView("M")} />
          </HStack>
        </HStack>
        {showCalendar(view)}
      </VStack>
    </Box>
  );
}
