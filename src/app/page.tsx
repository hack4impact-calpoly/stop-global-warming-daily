"use client";
import { Box, IconButton, Text, VStack, HStack } from "@chakra-ui/react";
import ChallengeComponent, { ChallengeSummary, ChallengeTask } from "@/components/ChallengeComponent";
import { LuChevronLeft, LuChevronRight, LuBell } from "react-icons/lu";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IUsers } from "@/database/userSchema";
import { useRouter } from "next/navigation";
import StreakCard from "@/components/StreakCard";

type HydratedChallenge = ChallengeSummary & {
  tasks: ChallengeTask[];
  completionPercentage: number;
};

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userData, setUserData] = useState<IUsers | null>(null);
  const [challenges, setChallenges] = useState<HydratedChallenge[]>([]);

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

        // check if user completed yesterday
        const completedDates = userObj.completedDates ?? [];

        if (completedDates.length > 0) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          const didYesterday = completedDates.some((d) => {
            const date = new Date(d);
            date.setHours(0, 0, 0, 0);
            return date.getTime() === yesterday.getTime();
          });

          if (!didYesterday && userObj.streak !== 0) {
            await fetch(`/api/user/${userObj._id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ streak: 0 }),
            });
          }
        }

        console.log("user is signed in!");
      }
    };

    if (!isLoaded) return;
    getUser();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    const getChallenges = async () => {
      if (!userData?._id) {
        setChallenges([]);
        return;
      }

      try {
        const res = await fetch(`/api/challenges/user/${userData._id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setChallenges([]);
          return;
        }

        const challengeData: HydratedChallenge[] = await res.json();
        console.log("challengeData", challengeData);
        setChallenges(challengeData);
      } catch (error) {
        console.error(error);
        setChallenges([]);
      }
    };

    getChallenges();
  }, [userData?._id]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <main>
      <Box display={"flex"} justifyContent={"center"}>
        <VStack maxW="400px" align="stretch" w="full" gap={2} p={5}>
          <HStack w={"full"} justifyContent={"space-between"}>
            <Text fontWeight={"semibold"} fontSize="4xl">
              Hi{userData ? ", " + String(userData.name.split(" ")[0]) : ""}!
            </Text>
            <Link href="/notifications" style={{ display: "flex", cursor: "pointer" }}>
              <LuBell size={24} />
            </Link>
          </HStack>

          <VStack w={"full"} gap={5} py={"20px"}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <IconButton aria-label="Previous Progress Ring" variant={"ghost"}>
                <LuChevronLeft />
              </IconButton>
              <Text fontSize={"x-large"} fontWeight={"semibold"}>
                Today
              </Text>
              <IconButton aria-label="Next Progress Ring" variant={"ghost"}>
                <LuChevronRight />
              </IconButton>
            </HStack>
            <StreakCard />
          </VStack>

          {challenges.length > 0 && (
            <VStack w="full" align="stretch" gap={3}>
              {challenges.map((challenge) => (
                <ChallengeComponent
                  key={challenge._id}
                  challenge={challenge}
                  tasks={challenge.tasks}
                  completionPercentage={challenge.completionPercentage}
                  userId={userData ? String(userData._id) : undefined}
                />
              ))}
            </VStack>
          )}

          <TaskList userId={userData ? String(userData._id) : undefined} />
        </VStack>
      </Box>
    </main>
  );
}
