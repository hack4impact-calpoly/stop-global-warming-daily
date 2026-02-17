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
    <Box
      position="fixed"
      bottom={{ base: "16px", sm: "20px" }}
      left="0"
      right="0"
      zIndex="1000"
      display="flex"
      justifyContent="center"
      px={3}
    >
      <HStack
        px={{ base: 4, sm: 8 }}
        py={{ base: 3, sm: 4 }}
        spacing={{ base: 3, sm: 6 }} // consistent spacing between icons
        bg="white"
        borderRadius="999px"
        boxShadow="0 18px 40px rgba(0,0,0,0.18)"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <VStack
                spacing={{ base: 0.5, sm: 1 }} // internal spacing
                px={{ base: 2, sm: 3 }} // consistent padding per tab
                py={{ base: 1, sm: 1.5 }}
                minW={{ base: "64px", sm: "72px" }} // consistent width per tab
                align="center"
                borderRadius="lg"
              >
                <Box as={Icon} boxSize={{ base: "22px", sm: "26px" }} color={isActive ? "#648DE5" : "gray.800"} />
                <Text
                  fontSize={{ base: "xs", sm: "sm" }}
                  fontWeight={isActive ? "700" : "600"}
                  color={isActive ? "#304C89" : "gray.800"}
                  lineHeight="1" // prevent vertical fidgeting
                  textAlign="center"
                  noOfLines={1} // prevent wrap changing widths
                  maxW={{ base: "64px", sm: "72px" }}
                >
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
