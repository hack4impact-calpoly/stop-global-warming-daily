"use client";

import Link from "next/link";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function AdminPage() {
  return (
    <Box display="flex" justifyContent="center">
      <VStack maxW="400px" align="stretch" w="full" gap={4} p={5}>
        <HStack gap={3}>
          <Link href="/profile" style={{ display: "flex", alignItems: "center" }}>
            <LuChevronLeft size={28} />
          </Link>
          <Text fontWeight="semibold" fontSize="4xl">
            Admin Settings
          </Text>
        </HStack>

        <VStack bg="gray.200" p={2} rounded="md" align="stretch" gap={2}>
          <Link href="/admin/manage-tasks" style={{ textDecoration: "none", color: "inherit" }}>
            <HStack w="full" justifyContent="space-between" cursor="pointer" p={2}>
              <Text fontWeight="normal" fontSize="md">
                Edit available tasks
              </Text>
              <LuChevronRight />
            </HStack>
          </Link>

          <Link href="/admin/manage-challenges" style={{ textDecoration: "none", color: "inherit" }}>
            <HStack w="full" justifyContent="space-between" cursor="pointer" p={2}>
              <Text fontWeight="normal" fontSize="md">
                Edit available challenges
              </Text>
              <LuChevronRight />
            </HStack>
          </Link>
        </VStack>
      </VStack>
    </Box>
  );
}
