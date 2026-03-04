"use client";
import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import CalendarSubHeader from "@/components/CalendarSubHeader";
import TaskList from "../TaskList";
import { IUsers } from "@/database/userSchema";

type WeekViewProps = {
  userData: IUsers | null;
};

export default function WeekView({ userData }: WeekViewProps) {
  return (
    <VStack>
      <CalendarSubHeader date="January 4-10"></CalendarSubHeader>
      <TaskList userId={userData ? String(userData._id) : undefined} showHeader={false} />
    </VStack>
  );
}
