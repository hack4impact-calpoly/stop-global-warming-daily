"use client";
import { HStack, Checkbox, Tag, Text, VStack } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingFooter from "@/components/OnboardingFooter";
import { LuCheck } from "react-icons/lu";

export const tags = [
  { label: "Sustainable Food", color: "#F2A62E" },
  { label: "Transportation", color: "#C667F2" },
  { label: "Shopping", color: "#2E86F2" },
  { label: "Community/Volunteering", color: "#F071B5" },
  { label: "Waste Reduction", color: "#F2682E" },
  { label: "Energy Saving", color: "#43C9C1" },
  { label: "Nature Preservation & Restoration", color: "#3FB84D" },
] as const;

export const focuses = [
  "Building daily eco-friendly habits",
  "Reducing my everyday waste",
  "Reducing my energy consumption",
  "Making more sustainable purchases",
  "Staying consistent and tracking my impact",
];

export default function Page() {
  const { user: savedUser, updateUserData, step: currentStep, updateStep } = useNewUserFormContext();
  const router = useRouter();

  const selectedTags = savedUser?.interests || [];
  const selectedFocuses = savedUser?.focuses || [];

  const handleToggleTag = (tag: string) => {
    const alreadySelected = selectedTags.includes(tag);

    // upto date tags
    const updatedTags = alreadySelected
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];
    //save to context
    updateUserData({
      interests: updatedTags,
    });
  };
  const handleToggleFocus = (focus: string) => {
    const alreadySelected = selectedFocuses.includes(focus);

    // upto date focuses
    const updatedFocuses = alreadySelected
      ? selectedFocuses.filter((selectedFocus) => selectedFocus !== focus)
      : [...selectedFocuses, focus];
    //save to context
    updateUserData({
      focuses: updatedFocuses,
    });
  };

  const handleNext = async () => {
    try {
      updateStep(currentStep + 1);
      router.push("/sign-up/select-profile");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
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

        <VStack w="100%" gap={5}>
          <VStack w="100%" gap={0}>
            <Text w="100%" fontSize="16px" fontWeight="semibold" color="black" textAlign="start">
              What areas are you interested in?
            </Text>

            <Text w="100%" color="#A9AEB1" fontSize="12px" textAlign="start">
              Select all that apply
            </Text>
          </VStack>

          {/* Tag Selection */}
          <HStack w="100%" align="start" flexWrap="wrap" gap={2}>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.label);
              return (
                <Tag.Root
                  key={tag.label}
                  variant="solid"
                  p="10px 17px"
                  size="lg"
                  rounded="full"
                  onClick={() => handleToggleTag(tag.label)}
                  bg={isSelected ? tag.color : "transparent"}
                  color={isSelected ? "#3B3B3B" : tag.color}
                  border="1px solid"
                  borderColor={tag.color}
                >
                  <Tag.Label fontSize={"12px"} fontWeight={"medium"}>
                    {tag.label}
                  </Tag.Label>

                  {isSelected && (
                    <Tag.EndElement>
                      <LuCheck size={14} />
                    </Tag.EndElement>
                  )}
                </Tag.Root>
              );
            })}
          </HStack>
        </VStack>

        <VStack w="100%" gap={2}>
          <Text w="100%" fontSize="16px" fontWeight="semibold" color="black" textAlign="start">
            What do you want to focus on?
          </Text>

          <Text w="100%" color="#A9AEB1" fontSize="12px" textAlign="start">
            Select all that apply
          </Text>

          <VStack w="100%" align="start" gap={4}>
            {focuses.map((focus) => {
              const isSelected = selectedFocuses.includes(focus);

              return (
                <Checkbox.Root key={focus} checked={isSelected} onCheckedChange={() => handleToggleFocus(focus)}>
                  <Checkbox.HiddenInput />

                  <Checkbox.Control
                    w="20px"
                    h="20px"
                    border="2px solid #000000"
                    borderRadius="4px"
                    bg="transparent"
                    color="#000000"
                  />

                  <Checkbox.Label fontSize="12px" fontWeight={"medium"} color="#000000">
                    {focus}
                  </Checkbox.Label>
                </Checkbox.Root>
              );
            })}
          </VStack>
        </VStack>
      </VStack>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </VStack>
  );
}
