"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { IoIosHome, IoIosCalendar } from "react-icons/io";
import { IoBookOutline, IoPersonCircleOutline } from "react-icons/io5";

const navItems = [
  { label: "Home", href: "/", icon: IoIosHome },
  { label: "Calendar", href: "/calendar", icon: IoIosCalendar },
  { label: "Resources", href: "/resources", icon: IoBookOutline },
  { label: "Profile", href: "/profile", icon: IoPersonCircleOutline },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Box position="fixed" bottom="20px" left="0" right="0" zIndex="1000" display="flex" justifyContent="center">
      <HStack px={8} py={4} gap={8} bg="white" borderRadius="999px" boxShadow="0 18px 40px rgba(0,0,0,0.18)">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <VStack gap={1} minW="70px">
                <Box as={Icon} boxSize="26px" color={isActive ? "#648DE5" : "gray.800"} />
                <Text fontSize="sm" fontWeight={isActive ? "700" : "600"} color={isActive ? "#304C89" : "gray.800"}>
                  {item.label}
                </Text>
              </VStack>
            </Link>
          );
        })}
      </HStack>
    </Box>
  );
}
