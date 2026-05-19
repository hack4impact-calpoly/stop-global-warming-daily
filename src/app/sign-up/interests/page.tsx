"use client";

import { Text, VStack } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useRouter } from "next/navigation";
import OnboardingFooter from "@/components/OnboardingFooter";
import ProfileInterestsForm from "@/components/ProfileInterestsForm";

export default function Page() {
  const { user: savedUser, updateUserData, step: currentStep, updateStep } = useNewUserFormContext();
  const router = useRouter();

  const handleNext = async () => {
    updateStep(currentStep + 1);
    router.push("/sign-up/select-profile");
  };

  const handleBack = () => {
    updateStep(currentStep - 1);
    router.back();
  };

  return (
    <VStack w="100%" flex="1" align="stretch" gap={0} pb={10}>
      <VStack w="100%" flex="1" align="center" justify="flex-start" gap={8} px={10}>
        <VStack w="100%" gap={0}>
          <Text fontSize="24px" lineHeight="29px" fontWeight="semibold" color="#057CC6" textAlign="start">
            Let&apos;s get to know you a bit better!
          </Text>

          <Text w="100%" color="#A9AEB1" fontSize="12px" textAlign="start">
            These answers can be updated later in your profile.
          </Text>
        </VStack>

        <ProfileInterestsForm
          selectedInterests={savedUser?.interests || []}
          onInterestsChange={(interests) => {
            updateUserData({ interests });
          }}
          selectedFocuses={savedUser?.focuses || []}
          onFocusesChange={(focuses) => {
            updateUserData({ focuses });
          }}
          showFocuses
        />
      </VStack>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </VStack>
  );
}
