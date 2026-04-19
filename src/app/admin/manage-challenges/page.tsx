"use client";

import Link from "next/link";
import { Box, Text, VStack, HStack, Input, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuSearch, LuPlus } from "react-icons/lu";
import AdminChallengeCard from "@/components/AdminChallengeCard";
const dummyChallengeForCard = {
  title: "Spring Challenge",
  description: "Description of challenge. We can have up to two lines of description.",
  isActive: true,
};
export default function ManageChallengePage() {
  return (
    <Box display="flex" justifyContent="center" minH="100vh">
      <Box maxW="400px" w="full" minH="100vh" p={5} pb={{ base: "140px", md: "40px" }}>
        <VStack align="stretch" gap={4}>
          <HStack gap={3}>
            <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
              <LuChevronLeft size={28} />
            </Link>

            <Text fontWeight="semibold" fontSize="4xl">
              Challenges
            </Text>
          </HStack>

          <Box position="relative">
            <Input placeholder="Search for a challenge..." bg="gray.200" border="none" borderRadius="full" pr="45px" />

            <Box
              position="absolute"
              right="14px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
              pointerEvents="none"
            >
              <LuSearch />
            </Box>
          </Box>
          <VStack>
            <AdminChallengeCard
              title={dummyChallengeForCard.title}
              description={dummyChallengeForCard.description}
              isActive={dummyChallengeForCard.isActive}
            />
          </VStack>
        </VStack>
      </Box>

      <IconButton
        aria-label="Add challenge"
        position="fixed"
        bottom={{ base: "110px", md: "24px" }}
        right="24px"
        w="64px"
        h="64px"
        borderRadius="full"
        variant="outline"
        borderColor="blue.300"
        color="blue.300"
        bg="white"
        zIndex={20}
      >
        <LuPlus size={28} />
      </IconButton>
    </Box>
  );
}
