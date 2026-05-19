"use client";

import { Text, VStack } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useRouter } from "next/navigation";
import OnboardingFooter from "@/components/OnboardingFooter";
import { useState } from "react";
import { personalizeSchema } from "@/lib/formSchemas/personalizeSchema";
import z from "zod";
import ProfileDetailsForm from "@/components/ProfileDetailsForm";

export default function Page() {
  const { user: savedUser, updateUserData, step: currentStep, updateStep } = useNewUserFormContext();
  const router = useRouter();

  const [errors, setErrors] = useState({
    birthday: "",
    location: "",
  });

  const handleNext = async () => {
    setErrors({
      birthday: "",
      location: "",
    });

    const result = personalizeSchema.safeParse({
      birthday: savedUser?.birthday,
      locationName: savedUser?.locationName ?? "",
      locationCoordinates: savedUser?.locationCoordinates ?? [],
    });

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;

      setErrors({
        birthday: fieldErrors.birthday?.[0] || "",
        location: fieldErrors.locationName?.[0] || fieldErrors.locationCoordinates?.[0] || "",
      });

      return;
    }

    updateUserData({
      birthday: result.data.birthday,
      locationName: result.data.locationName,
      locationCoordinates: result.data.locationCoordinates,
    });

    updateStep(currentStep + 1);
    router.push("/sign-up/interests");
  };

  const handleBack = () => {
    updateStep(currentStep - 2);
    router.push("/sign-up/account");
  };

  return (
    <VStack w="100%" flex="1" align="stretch" gap={0} pb={10}>
      <VStack w="100%" flex="1" align="center" justify="flex-start" gap={10} px={10}>
        <Text fontSize="24px" lineHeight="29px" fontWeight="600" color="#057CC6" textAlign="start">
          We&apos;ll personalize tasks and local resources for you.
        </Text>

        <ProfileDetailsForm
          value={{
            birthday: savedUser?.birthday,
            locationName: savedUser?.locationName || "",
            locationCoordinates: savedUser?.locationCoordinates || [],
          }}
          onChange={(value) => {
            updateUserData(value);
          }}
          errors={errors}
          onClearError={(field) => {
            setErrors((prev) => ({
              ...prev,
              [field]: "",
            }));
          }}
        />
      </VStack>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </VStack>
  );
}
