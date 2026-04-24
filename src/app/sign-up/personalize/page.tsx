"use client";
import { VStack, Button, HStack } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingFooter from "@/components/OnboardingFooter";

export default function Page() {
  const { step: currentStep, updateStep } = useNewUserFormContext(); //current step
  const router = useRouter();

  const handleNext = async () => {
    try {
      updateStep(currentStep + 1);
      router.push("/sign-up/interests");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleBack = () => {
    updateStep(currentStep - 2);
    router.push("/sign-up/account");
  };

  return (
    <>
      <VStack></VStack>
      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </>
  );
}
