"use client";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";
import { IUsers } from "@/database/userSchema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DayView, WeekView, MonthView } from "@/components/calendar";
import CalendarSwitchButton from "@/components/CalendarSwitchButton";

export default function Page() {
  //use localStorage to save selected tab
  const [view, setView] = useState<"D" | "W" | "M">("D");

  const { isSignedIn, user, isLoaded } = useUser();
  const [userData, setUserData] = useState<IUsers | null>(null);

  const router = useRouter();

  // restore saved view on mount
  useEffect(() => {
    const savedView = localStorage.getItem("calendarView");
    if (savedView === "D" || savedView === "W" || savedView === "M") {
      setView(savedView);
    }
  }, []);

  const handleSetView = (v: "D" | "W" | "M") => {
    setView(v);
    localStorage.setItem("calendarView", v);
  };

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
    if (selectCalendar === "D") return <DayView userData={userData} />;
    if (selectCalendar === "W") return <WeekView userData={userData} />;
    return <MonthView />;
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <VStack maxW="400px" align="stretch" w="full" gap={2} px={5}>
        <HStack w="full" justify="space-between" align="center">
          <Text fontSize="4xl" letterSpacing="-0.05em" whiteSpace="nowrap" fontWeight={"semibold"}>
            My Calendar
          </Text>
          <HStack bg="#E8F1F8" px={1} py={1} borderRadius="full" align="center">
            <CalendarSwitchButton label="D" selected={view === "D"} onClick={() => handleSetView("D")} />
            <CalendarSwitchButton label="W" selected={view === "W"} onClick={() => handleSetView("W")} />
            <CalendarSwitchButton label="M" selected={view === "M"} onClick={() => handleSetView("M")} />
          </HStack>
        </HStack>
        {showCalendar(view)}
      </VStack>
    </Box>
  );
}
