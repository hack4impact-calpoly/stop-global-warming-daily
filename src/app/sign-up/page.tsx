"use client";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { VStack, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const { step: currentStep, updateStep } = useNewUserFormContext();

  const onNext = async () => {
    updateStep(currentStep + 1);
    router.push("/sign-up/step1");
  };

  return (
    <VStack w={"100%"} gap={10} px={10}>
      <VStack gap={5}>
        <Text fontSize="32px" color={"#057CC6"} fontWeight={"semibold"} textAlign={"center"} lineHeight={"39px"}>
          Build small habits. Make a real impact.
        </Text>

        <Text fontSize="24px" color={"#000000"} fontWeight={"semibold"} textAlign={"center"} lineHeight={"29px"}>
          Track simple daily actions that reduce your carbon footprint.
        </Text>
      </VStack>

      <Image
        src="/images/green-earth.svg"
        alt="Globe Image"
        width={500}
        height={500}
        priority
        style={{
          width: "100%",
          height: "auto",
        }}
      />

      <Button w={"100%"} px={10} py={6} h="50px" borderRadius={8} bg="#64B9FF" color="white" onClick={onNext}>
        Get Started
      </Button>
    </VStack>
  );
}
