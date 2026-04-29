"use client";
import { VStack, Text, Box, Button } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useRouter } from "next/navigation";
import { LuCheck } from "react-icons/lu";

const AVATARS: string[] = [
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
  "/avatars/avatar-5.png",
  "/avatars/avatar-6.png",
];

export default function Page() {
  const { user: savedUser } = useNewUserFormContext();
  const router = useRouter();

  const handleNext = async () => {
    try {
      router.push("/"); // update route as needed
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <VStack w="100%" flex="1" align="center" justify="flex-start" gap={"70px"} px={10}>
      <Text w="100%" fontSize="32px" lineHeight="39px" fontWeight="semibold" color="#057CC6" textAlign="center">
        You&apos;re all set, {savedUser?.firstname}!
      </Text>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h={"206px"}
        w={"206px"}
        borderRadius={"full"}
        bg={"linear-gradient(130.74deg, #64B9FF 3.21%, #057CC6 96.79%)"}
      >
        <LuCheck size={"125px"} color="#000000" />
      </Box>
      <Button w={"100%"} h={"50px"} borderRadius={"8px"} bg={"#64B9FF"} color={"white"} onClick={handleNext}>
        Go to Today&apos;s Task
      </Button>
    </VStack>
  );
}
