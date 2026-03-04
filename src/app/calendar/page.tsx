"use client";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import MonthlyCalendar from "@/components/MonthlyCalendar";
import React from "react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import CalendarSwitchButton from "@/components/CalendarSwitchButton";
import TaskList from "@/components/TaskList";
import { useState, useEffect } from "react";
import { IUsers } from "@/database/userSchema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const [view, setView] = React.useState<"D" | "W" | "M">("M");
  const { isSignedIn, user, isLoaded } = useUser();
  const [userData, setUserData] = useState<IUsers | null>(null);

  const router = useRouter();

  // if user is not signed in redirect to login page
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const getUser = async () => {
      if (user && isSignedIn) {
        const email = encodeURIComponent(user.emailAddresses[0].emailAddress);
        const res = await fetch(`/api/user/email/${email}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setUserData(null);
          return;
        }

        const userObj: IUsers = await res.json();
        setUserData(userObj);
        console.log("user is signed in!");
      }
    };
    if (!isLoaded) {
      return;
    }
    // get user
    getUser();
  }, [isLoaded, isSignedIn, user]);

  const formatDayLabel = (date: Date) => {
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    return `${date.toLocaleString("en-US", { month: "long" })} ${day}${suffix}`;
  };

  const showCalendar = (selectCalendar: string) => {
    if (selectCalendar === "D")
      return (
        <>
          <CalendarSubHeader date={formatDayLabel(new Date())}></CalendarSubHeader>
          <TaskList userId={userData ? String(userData._id) : undefined} />
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
          <CalendarSubHeader
            date={new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
          ></CalendarSubHeader>
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
