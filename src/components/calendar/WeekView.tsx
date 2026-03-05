"use client";
import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import TaskList from "../TaskList";
import { IUsers } from "@/database/userSchema";
import WeeklyTaskList from "../WeeklyTaskList";

type WeekViewProps = {
  userData: IUsers | null;
};

export default function WeekView({ userData }: WeekViewProps) {
  return (
    <VStack>
      <WeeklyTaskList referenceDate={new Date()} userId={userData ? String(userData._id) : undefined} />
    </VStack>
  );
}
