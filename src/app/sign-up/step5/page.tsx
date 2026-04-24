"use client";
import { VStack, Button, HStack } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { step: currentStep, updateStep } = useNewUserFormContext(); //current step
  const router = useRouter();

  const onNext = async () => {
    try {
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onBack = () => {
    updateStep(currentStep - 1);
    router.back();
  };

  return (
    <>
      <VStack></VStack>
      <HStack position="absolute" bottom={10} left={0} right={0} h="80px" px={10} alignItems="center">
        <Button
          variant="outline"
          px={10}
          py={7}
          borderRadius={8}
          bg="#F9FAFB"
          color="#64B9FF"
          borderColor={"#64B9FF"}
          _hover={{ bg: "#17374b" }}
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          ml="auto"
          px={10}
          py={7}
          borderRadius={8}
          bg="#64B9FF"
          color="white"
          _hover={{ bg: "#17374b" }}
          onClick={onNext}
        >
          Next
        </Button>
      </HStack>
    </>
  );
}
