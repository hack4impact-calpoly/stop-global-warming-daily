"use client";
import { VStack, Text, Box, Button } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useRouter } from "next/navigation";
import { LuCheck } from "react-icons/lu";

const AVATARS: string[] = [
  "/images/profile-pictures/profile-picture-1.svg",
  "/images/profile-pictures/profile-picture-2.svg",
  "/images/profile-pictures/profile-picture-3.svg",
  "/images/profile-pictures/profile-picture-4.svg",
  "/images/profile-pictures/profile-picture-5.svg",
  "/images/profile-pictures/profile-picture-6.svg",
  "/images/profile-pictures/profile-picture-7.svg",
  "/images/profile-pictures/profile-picture-8.svg",
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
