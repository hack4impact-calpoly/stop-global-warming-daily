import { Box, IconButton, Text, VStack, HStack } from "@chakra-ui/react";
import ProgressRing from "@/components/ProgressRing";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Home() {
  return (
    <main>
      <Box display={"flex"} alignItems={"center"}>
        <VStack w={"full"}>
          <Text>Home</Text>
          {/* Progress Ring */}
          <VStack w={"full"} gap={5} padding={"20px"}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <IconButton area-label="Previous Progress Ring" variant={"ghost"}>
                <FaChevronLeft />
              </IconButton>
              <Text fontSize={"x-large"} fontWeight={"semibold"}>
                Today
              </Text>
              <IconButton area-label="Next Progress Ring" variant={"ghost"}>
                <FaChevronRight />
              </IconButton>
            </HStack>
            <ProgressRing percent={70} isClockwise={false} />
          </VStack>
        </VStack>
      </Box>
    </main>
  );
}
