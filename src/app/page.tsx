"use client";
import { Box, IconButton, Text, VStack, HStack } from "@chakra-ui/react";
import ProgressRing from "@/components/ProgressRing";
import ChallengeComponent, { ChallengeSummary, ChallengeTask } from "@/components/ChallengeComponent";
import { LuChevronLeft, LuChevronRight, LuBell } from "react-icons/lu";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IUsers } from "@/database/userSchema";
import { useRouter } from "next/navigation";

export default function Home() {
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

  return (
    <main>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <VStack maxW={400} w={"full"} gap={0}>
          <HStack w={"full"} justifyContent={"space-between"} padding={"20px"}>
            <Text fontWeight={"semibold"} fontSize={32}>
              Hi, Ethan!
            </Text>
            <Link href="/notifications" style={{ display: "flex", cursor: "pointer" }}>
              <LuBell size={24} />
            </Link>
          </HStack>
          {/* Progress Ring */}
          <VStack w={"full"} gap={5} padding={"20px"}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <IconButton area-label="Previous Progress Ring" variant={"ghost"}>
                <LuChevronLeft />
              </IconButton>
              <Text fontSize={"x-large"} fontWeight={"semibold"}>
                Today
              </Text>
              <IconButton area-label="Next Progress Ring" variant={"ghost"}>
                <LuChevronRight />
              </IconButton>
            </HStack>
            <ProgressRing percent={70} isClockwise={false} />
          </VStack>
          {/* Tasks */}
          <TaskList userId={userData ? String(userData._id) : undefined} />
        </VStack>
      </Box>
    </main>
  );
}
