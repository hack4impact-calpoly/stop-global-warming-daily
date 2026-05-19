"use client";

import { Checkbox, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import { FOCUSES, INTEREST_TAGS } from "@/lib/profileOptions";

type ProfileInterestsFormProps = {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;

  selectedFocuses?: string[];
  onFocusesChange?: (focuses: string[]) => void;

  showFocuses?: boolean;
};

export default function ProfileInterestsForm({
  selectedInterests,
  onInterestsChange,
  selectedFocuses = [],
  onFocusesChange,
  showFocuses = false,
}: ProfileInterestsFormProps) {
  const handleToggleInterest = (tag: string) => {
    const alreadySelected = selectedInterests.includes(tag);

    const updatedInterests = alreadySelected
      ? selectedInterests.filter((selectedTag) => selectedTag !== tag)
      : [...selectedInterests, tag];

    onInterestsChange(updatedInterests);
  };

  const handleToggleFocus = (focus: string) => {
    if (!onFocusesChange) return;

    const alreadySelected = selectedFocuses.includes(focus);

    const updatedFocuses = alreadySelected
      ? selectedFocuses.filter((selectedFocus) => selectedFocus !== focus)
      : [...selectedFocuses, focus];

    onFocusesChange(updatedFocuses);
  };

  return (
    <VStack w="100%" gap={5} align="stretch">
      <VStack w="100%" gap={0}>
        <Text w="100%" fontSize="16px" fontWeight="semibold" color="black" textAlign="start">
          What areas are you interested in?
        </Text>

        <Text w="100%" color="#A9AEB1" fontSize="12px" textAlign="start">
          Select all that apply
        </Text>
      </VStack>

      <HStack w="100%" align="start" flexWrap="wrap" gap={2}>
        {INTEREST_TAGS.map((tag) => {
          const isSelected = selectedInterests.includes(tag.label);

          return (
            <Tag.Root
              key={tag.label}
              variant="solid"
              p="10px 17px"
              size="lg"
              rounded="full"
              cursor="pointer"
              onClick={() => handleToggleInterest(tag.label)}
              bg={isSelected ? tag.color : "transparent"}
              color={isSelected ? "#3B3B3B" : tag.color}
              border="1px solid"
              borderColor={tag.color}
            >
              <Tag.Label fontSize="12px" fontWeight="medium">
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

      {showFocuses && (
        <VStack w="100%" gap={2}>
          <Text w="100%" fontSize="16px" fontWeight="semibold" color="black" textAlign="start">
            What do you want to focus on?
          </Text>

          <Text w="100%" color="#A9AEB1" fontSize="12px" textAlign="start">
            Select all that apply
          </Text>

          <VStack w="100%" align="start" gap={4}>
            {FOCUSES.map((focus) => {
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

                  <Checkbox.Label fontSize="12px" fontWeight="medium" color="#000000">
                    {focus}
                  </Checkbox.Label>
                </Checkbox.Root>
              );
            })}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
}
