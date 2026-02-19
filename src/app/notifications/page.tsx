import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { LuMailbox, LuChevronLeft, LuSettings } from "react-icons/lu";
import Link from "next/link";
import NotificationCard from "@/components/NotificationCard";

type Notification = {
  id: string;
  title: string;
  timeAgo: string;
  icon?: string;
  unread?: boolean;
};

export default function Page() {
  const notifications: Notification[] = [
    { id: "1", title: "You reached a personal best!", timeAgo: "23hr ago", icon: "🏆", unread: true },
    { id: "2", title: "Spring Challenges are here!", timeAgo: "2 days ago", unread: false },
    { id: "3", title: "Your weekly summary is ready", timeAgo: "4 days ago", unread: true },
  ];

  return (
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <VStack maxW={400} w={"full"} gap={0}>
        <HStack w="full" px="20px" py="20px" justify="space-between">
          <HStack gap={3} align="baseline">
            <Link href="/" style={{ display: "inline-flex" }}>
              <LuChevronLeft size={24} style={{ display: "block" }} />
            </Link>
            <Text fontSize="32px" fontWeight="semibold" lineHeight="1" display="inline">
              Notifications
            </Text>
          </HStack>
          <Link href="/settings" style={{ display: "inline-flex" }}>
            <LuSettings size={24} style={{ display: "block" }} />
          </Link>
        </HStack>

        <VStack w={"full"} gap={0} mb={20}>
          {notifications.map((n) => (
            <NotificationCard key={n.id} title={n.title} timeAgo={n.timeAgo} icon={n.icon} unread={n.unread} />
          ))}
        </VStack>
        <VStack flex={1} justifyContent={"center"} alignItems={"center"}>
          <LuMailbox size="130px" color="#16243F" />
          <VStack mt={-8} gap={1}>
            <Text fontSize={24}>No more notifications</Text>
            <Text w={"200px"} textAlign={"center"} fontSize={11} fontWeight="medium" lineHeight={1}>
              Missing notifications? Visit your <br />
              <Text as="span" color="#0084FF" textDecoration="underline">
                historical notifications
              </Text>
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  );
}
