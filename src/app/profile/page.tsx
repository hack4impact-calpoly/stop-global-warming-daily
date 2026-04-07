"use client";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { LuSettings, LuSquarePen, LuChevronRight, LuHeart, LuShieldCheck } from "react-icons/lu";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  const { user } = useUser();

  return (
    <Box display="flex">
      <VStack maxW="400px" align="stretch" w="full" gap={2} p={5}>
        <HStack w="full" justifyContent="space-between">
          <Text fontWeight={"semibold"} fontSize="4xl">
            Account
          </Text>
          <Link href="/settings" style={{ display: "flex", cursor: "pointer" }}>
            <LuSettings size={30} />
          </Link>
        </HStack>

        <Box bg="gray.200" p={2} w="full" justifyContent="space-between" rounded="md">
          <Text fontWeight="medium" fontSize="2xl" alignContent={"left"}>
            {user ? user.fullName : ""}
          </Text>
          <Text fontWeight="normal" fontSize="md">
            {user ? String(user.emailAddresses[0]) : ""}
          </Text>
        </Box>

        <VStack bg="gray.200" p={2} my={4} rounded="md" align="stretch">
          <HStack w="full" justifyContent="space-between">
            <HStack>
              <LuSquarePen />
              <Text fontWeight="normal" fontSize="md">
                Edit Profile
              </Text>
            </HStack>
            <LuChevronRight />
          </HStack>

          <HStack w="full" justifyContent="space-between">
            <HStack>
              <LuHeart />
              <Text fontWeight="normal" fontSize="md">
                Change Interests
              </Text>
            </HStack>
            <LuChevronRight />
          </HStack>

          <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>
            <HStack w="full" justifyContent="space-between" cursor="pointer">
              <HStack>
                <LuShieldCheck />
                <Text fontWeight="normal" fontSize="md">
                  Admin Settings
                </Text>
              </HStack>
              <LuChevronRight />
            </HStack>
          </Link>
        </VStack>

        <VStack bgColor="#296184" rounded="md" fontSize="md" color="white">
          <SignOutButton />
        </VStack>
      </VStack>
    </Box>
  );
}
