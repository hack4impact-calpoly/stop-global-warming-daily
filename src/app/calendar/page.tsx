"use client";
import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IUsers } from "@/database/userSchema";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DayView, WeekView, MonthView } from "@/components/calendar";
import CalendarSwitchButton from "@/components/CalendarSwitchButton";

export default function Page() {
  //use URL queries to save selected tab
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const view = (searchParams.get("view") as "D" | "W" | "M") ?? "M";

  const { isSignedIn, user, isLoaded } = useUser();
  const [userData, setUserData] = useState<IUsers | null>(null);

  const router = useRouter();

  const handleSetView = (v: "D" | "W" | "M") => {
    router.replace(`${pathname}?view=${v}`);
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
        let res = await fetch(`/api/user/email/${user.emailAddresses[0].emailAddress}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res) {
          const userObj = await res.json();
          setUserData(userObj);
          console.log("user is signed in!");
        }
      }
    };
    if (!isLoaded) {
      return;
    }
    // get user
    getUser();
  }, [isLoaded, isSignedIn, user]);

  const showCalendar = (selectCalendar: string) => {
    if (selectCalendar === "D") return <DayView />;
    if (selectCalendar === "W") return <WeekView />;
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
