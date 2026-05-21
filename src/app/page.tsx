"use client";
import { Box, IconButton, Text, VStack, HStack } from "@chakra-ui/react";
import ChallengeComponent, { ChallengeSummary, ChallengeTask } from "@/components/ChallengeComponent";
import { LuChevronLeft, LuChevronRight, LuBell } from "react-icons/lu";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { IUsers } from "@/database/userSchema";
import { useRouter } from "next/navigation";
import StreakCard from "@/components/StreakCard";

type HydratedChallenge = ChallengeSummary & {
  tasks: ChallengeTask[];
  completionPercentage: number;
};
import PushNotificationManager from "@/components/PushNotificationManager";
import InstallPrompt from "@/components/InstallPrompt";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userData, setUserData] = useState<IUsers | null>(null);
  const [challenges, setChallenges] = useState<HydratedChallenge[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const didAssignToday = useRef(false);

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

        // assign daily task
        if (!didAssignToday.current) {
          didAssignToday.current = true;

          const res = await fetch(`/api/taskAssignment/assignToday`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userObj._id }),
          });

          if (res.ok) {
            setRefreshKey((prev) => prev + 1);
          }

          console.log("user is signed in!");
        }
      }
    };

    if (!isLoaded) return;
    getUser();
  }, [isLoaded, isSignedIn, user, refreshKey]);

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

  const refreshUser = () => {
    setRefreshKey((prev) => prev + 1);
  };
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
          <div>
            {userData && !userData.notificationsAsked && (
              <PushNotificationManager userData={userData} setUserData={setUserData} />
            )}
            {userData && !userData.installationAsked && <InstallPrompt userData={userData} setUserData={setUserData} />}
          </div>

          <VStack w={"full"} gap={5} py={"20px"}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <IconButton aria-label="Previous Progress Ring" variant={"ghost"} size={"2xl"}>
                <LuChevronLeft />
              </IconButton>
              <Text fontSize={"42px"} fontWeight={"600"}>
                Today
              </Text>
              <IconButton aria-label="Next Progress Ring" variant={"ghost"} size={"2xl"}>
                <LuChevronRight />
              </IconButton>
            </HStack>
            <StreakCard streak={userData?.streak} completedDates={userData?.completedDates} />
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

          <TaskList
            userId={userData ? String(userData._id) : undefined}
            refreshKey={refreshKey}
            onChange={refreshUser}
          />
        </VStack>
      </Box>
    </main>
  );
}
