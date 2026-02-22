"use client";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import React from "react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
export default function Page() {
  const [view, setView] = React.useState<"D" | "W" | "M">("M");

  const styleButton = (selectView: string, option: string) => {
    const selected = selectView === option;
    return {
      w: "30px",
      h: "30px",
      borderRadius: "full",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      bg: selected ? "blue.400" : "transparent",
      color: "black",
      _hover: {
        bg: selected ? "#5C7DE0" : "#DDE0EC",
      },
    };
  };

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
            <Box {...styleButton(view, "D")} onClick={() => setView("D")}>
              D
            </Box>
            <Box {...styleButton(view, "W")} onClick={() => setView("W")}>
              W
            </Box>
            <Box {...styleButton(view, "M")} onClick={() => setView("M")}>
              M
            </Box>
          </HStack>
        </HStack>
        {showCalendar(view)}
      </VStack>
    </Box>
  );
}
