"use client";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";
import { IUsers } from "@/database/userSchema";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { DayView, WeekView, MonthView } from "@/components/calendar";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import CalendarSwitchButton from "@/components/CalendarSwitchButton";

const addDays = (date: Date, amount: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};

const addMonths = (date: Date, amount: number) => {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + amount);
  return nextDate;
};

const getWeekStart = (date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
};

const getDaySuffix = (day: number) => {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  if (day % 10 === 1) return "st";
  if (day % 10 === 2) return "nd";
  if (day % 10 === 3) return "rd";
  return "th";
};

const formatSingleDayLabel = (date: Date) => {
  return `${date.toLocaleString("en-US", { month: "long" })} ${date.getDate()}${getDaySuffix(date.getDate())}`;
};

const formatWeekRangeLabel = (date: Date) => {
  const start = getWeekStart(date);
  const end = addDays(start, 6);
  const startMonth = start.toLocaleString("en-US", { month: "long" });
  const endMonth = end.toLocaleString("en-US", { month: "long" });

  if (startMonth === endMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}`;
  }

  return `${startMonth} ${start.getDate()}-${endMonth} ${end.getDate()}`;
};

const formatMonthLabel = (date: Date) => {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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

        const userObj = await res.json();
        setUserData(Array.isArray(userObj) ? (userObj[0] ?? null) : userObj);
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
          <CalendarSubHeader
            date={formatSingleDayLabel(selectedDate)}
            onPrevious={() => setSelectedDate((prev) => addDays(prev, -1))}
            onNext={() => setSelectedDate((prev) => addDays(prev, 1))}
          ></CalendarSubHeader>
          <DayView userData={userData} />
        </>
      );
    else if (selectCalendar === "W")
      return (
        <>
          <CalendarSubHeader
            date={formatWeekRangeLabel(selectedDate)}
            onPrevious={() => setSelectedDate((prev) => addDays(prev, -7))}
            onNext={() => setSelectedDate((prev) => addDays(prev, 7))}
          ></CalendarSubHeader>
          <WeekView userData={userData} />
        </>
      );
    else
      return (
        <>
          <CalendarSubHeader
            date={formatMonthLabel(selectedDate)}
            onPrevious={() => setSelectedDate((prev) => addMonths(prev, -1))}
            onNext={() => setSelectedDate((prev) => addMonths(prev, 1))}
          ></CalendarSubHeader>
          <MonthView selectedDate={selectedDate} userId={userData ? String(userData._id) : undefined} />
        </>
      );
  };

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <VStack maxW="400px" align="stretch" w="full" gap={2} p={5}>
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
