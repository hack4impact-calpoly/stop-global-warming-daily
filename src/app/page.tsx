import { Box, IconButton, Text, VStack, HStack } from "@chakra-ui/react";
import ProgressRing from "@/components/ProgressRing";
import ChallengeComponent, { ChallengeSummary, ChallengeTask } from "@/components/ChallengeComponent";
import { LuChevronLeft, LuChevronRight, LuBell } from "react-icons/lu";
import Link from "next/link";

type ChallengeWithTasks = {
  challenge: ChallengeSummary;
  tasks: ChallengeTask[];
  defaultOpen?: boolean;
};

const challengeSections: ChallengeWithTasks[] = [
  {
    challenge: {
      _id: "challenge-1",
      title: "SLO SGWD",
      task_ids: ["task-1", "task-2"],
      users: ["user-1"],
      color: "#4CA6DB",
    },
    tasks: [
      {
        _id: "task-1",
        title: "Carpool to work",
        description: "Save energy and money by ridesharing.",
        points: 15,
        completed: true,
        dueDate: "2026-02-19",
      },
      {
        _id: "task-2",
        title: "Farmer's Market",
        description: "Buy local produce this week.",
        points: 20,
        completed: false,
        dueDate: "2026-02-20",
      },
    ],
    defaultOpen: true,
  },
  {
    challenge: {
      _id: "challenge-2",
      title: "Spring Challenge",
      task_ids: ["task-3", "task-4", "task-5"],
      users: ["user-1"],
      color: "#6AADE4",
    },
    tasks: [
      {
        _id: "task-3",
        title: "Bring reusable bottle",
        description: "Skip single-use plastic all day.",
        points: 10,
        completed: false,
        dueDate: "2026-02-21",
      },
      {
        _id: "task-4",
        title: "Walk for short trips",
        description: "Take at least one local trip by foot.",
        points: 15,
        completed: false,
        dueDate: "2026-02-21",
      },
      {
        _id: "task-5",
        title: "Shorten shower time",
        description: "Reduce hot water use by five minutes.",
        points: 15,
        completed: true,
        dueDate: "2026-02-22",
      },
    ],
  },
  {
    challenge: {
      _id: "challenge-3",
      title: "Campus Commute",
      task_ids: ["task-6", "task-7"],
      users: ["user-1"],
      color: "#57B5C6",
    },
    tasks: [
      {
        _id: "task-6",
        title: "Bike to class",
        description: "Replace one car ride with a bike trip.",
        points: 20,
        completed: true,
        dueDate: "2026-02-23",
      },
      {
        _id: "task-7",
        title: "Charge devices off-peak",
        description: "Plug in electronics before bedtime.",
        points: 10,
        completed: true,
        dueDate: "2026-02-23",
      },
    ],
  },
];

export default function Home() {
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
          <VStack w={"full"} gap={4} padding={"20px"}>
            {challengeSections.map(({ challenge, tasks, defaultOpen }) => {
              const completedCount = tasks.filter((task) => task.completed).length;
              const completionPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

              return (
                <ChallengeComponent
                  key={challenge._id}
                  challenge={challenge}
                  tasks={tasks}
                  completionPercentage={completionPercentage}
                  defaultOpen={defaultOpen}
                />
              );
            })}
          </VStack>
        </VStack>
      </Box>
    </main>
  );
}
