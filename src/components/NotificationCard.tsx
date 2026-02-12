import { Box, Grid, HStack, IconButton, Text, VStack } from "@chakra-ui/react";

type Props = {
  title: string;
  timeAgo: string;
  icon?: string;
  unread?: boolean;
};

export default function NotificationCard({ title, timeAgo, icon, unread }: Props) {
  return (
    <HStack w="full" py={6} px={5} borderBottom=".5px solid" borderColor="#16243F" justify="space-between">
      <HStack align="center" gap={8}>
        <VStack align="flex-start" gap={0} flex={1}>
          <Text fontSize="16px" fontWeight="semibold">
            {title}
          </Text>

          <Text fontSize="11px" color="#16243F" opacity="60%" lineHeight="1">
            {timeAgo}
          </Text>
        </VStack>
        {icon ? (
          <Box>
            <Text fontSize="24px" lineHeight="1">
              {icon}
            </Text>
          </Box>
        ) : null}
      </HStack>

      {unread ? <Box w="10px" h="10px" borderRadius="full" bg="#63ADF2" /> : null}
    </HStack>
  );
}
