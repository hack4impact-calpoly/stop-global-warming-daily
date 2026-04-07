"use client";
import { Box, Text, VStack, HStack, IconButton, Skeleton } from "@chakra-ui/react";
import {
  LuSettings,
  LuSquarePen,
  LuChevronRight,
  LuHeart,
  LuShieldCheck,
  LuCamera,
  LuBadgeCheck,
  LuFlame,
} from "react-icons/lu";
import { SignOutButton } from "@clerk/nextjs";
import { IconType } from "react-icons";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Page() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <VStack display="flex" justifyContent="center" gap={30}>
      <VStack maxW="400px" align="stretch" w="full" gap={2} p={5}>
        {/* Header */}
        <HStack w="full" justifyContent="space-between">
          <Text fontWeight="semibold" fontSize="4xl">
            Account
          </Text>
          <Link href="/settings" style={{ display: "flex", cursor: "pointer" }}>
            <LuSettings size={30} />
          </Link>
        </HStack>

        {/* Profile */}
        <HStack justifyContent="center" gap={5}>
          <Box position="relative" width="110px" height="110px">
            <Box bg="gray.200" w="100%" h="100%" borderRadius="full">
              {/* IMAGE HERE */}
            </Box>

            <IconButton
              aria-label="Change profile photo"
              variant="outline"
              size="sm"
              borderRadius="full"
              position="absolute"
              bottom="0"
              right="0"
              bg="#F9FAFB"
              borderColor="#3B3B3B"
              borderWidth={2}
            >
              <LuCamera color="#3B3B3B" />
            </IconButton>
          </Box>

          <VStack gap={0} align="stretch" minW="200px">
            <Skeleton loading={!user} height="7" rounded="md">
              <Text fontWeight="bold" fontSize="2xl">
                {user?.fullName ?? ""}
                {isAdmin && (
                  <Box as="span" display="inline-block" ml={2} verticalAlign="baseline">
                    <LuShieldCheck size={18} />
                  </Box>
                )}
              </Text>
            </Skeleton>

            <Skeleton loading={!user} height="4" mt={1} rounded="md">
              <Text fontWeight="normal" fontSize="xs">
                {user?.primaryEmailAddress?.emailAddress ?? "loading@email.com"}
              </Text>
            </Skeleton>
          </VStack>
        </HStack>
      </VStack>

      {/* Options */}
      <VStack
        w="100%"
        h="100%"
        alignItems="center"
        bg="white"
        align="stretch"
        gap={5}
        p={5}
        borderRadius="20px 20px 0 0"
      >
        {isAdmin && (
          <Link href="/admin/settings" style={{ width: "100%", maxWidth: "400px" }}>
            <HStack bg="#F6F6F6" w="full" justifyContent="space-between" rounded="xl" p={5} pl={8}>
              <HStack gap={3}>
                <LuShieldCheck size={35} />
                <Text fontWeight="normal" fontSize="lg">
                  Admin Settings
                </Text>
              </HStack>
              <LuChevronRight size={25} />
            </HStack>
          </Link>
        )}

        <VStack w="full" maxW="400px" bg="#F6F6F6" align="stretch" rounded="xl" gap={0}>
          <Card icon={LuSquarePen} label="Edit Profile" href="/profile/edit-profile" />
          <Card icon={LuHeart} label="Change Interests" href="/profile/interests" />
        </VStack>

        <VStack w="full" maxW="400px" bg="#F6F6F6" align="stretch" rounded="xl" gap={0}>
          <Card icon={LuBadgeCheck} label="View Badges" href="/profile/badges" />
          <Card icon={LuFlame} label="Current Progress" href="/profile/progress" />
        </VStack>

        <Box w="full" maxW="400px" bg="#296184" textAlign={"center"} color="white" rounded="xl" p={4}>
          <SignOutButton />
        </Box>
      </VStack>
    </VStack>
  );
}

function Card({ icon: Icon, label, href }: { icon: IconType; label: string; href: string }) {
  return (
    <Link href={href}>
      <HStack w="full" justifyContent="space-between" paddingLeft={"50px"} pl={8} pr={4} py={4} rounded="xl">
        <HStack gap={3}>
          <Box bg="#DEDEDE" p={2} borderRadius="full" boxShadow="sm">
            <Icon size={20} />
          </Box>
          <Text fontWeight="normal" fontSize="md">
            {label}
          </Text>
        </HStack>
        <LuChevronRight size={25} />
      </HStack>
    </Link>
  );
}
