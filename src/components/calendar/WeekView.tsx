"use client";
import { VStack } from "@chakra-ui/react";
import { IUsers } from "@/database/userSchema";
import WeeklyTaskList from "../WeeklyTaskList";

type WeekViewProps = {
  userData: IUsers | null;
  selectedDate: Date;
};

export default function WeekView({ userData, selectedDate }: WeekViewProps) {
  return (
    <VStack>
      <WeeklyTaskList referenceDate={selectedDate} userId={userData ? String(userData._id) : undefined} />
    </VStack>
  );
}
