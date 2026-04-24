"use client";

import { HStack, Button } from "@chakra-ui/react";

interface OnboardingFooterProps {
  onBack?: () => void;
  onNext?: () => void;
}

export default function OnboardingFooter({ onBack, onNext }: OnboardingFooterProps) {
  if (!onBack && !onNext) return null;

  return (
    <HStack position="absolute" bottom={10} left={0} right={0} h="80px" px={10} alignItems="center">
      {onBack && (
        <Button
          variant="outline"
          px={10}
          py={7}
          borderRadius={8}
          bg="#F9FAFB"
          color="#64B9FF"
          borderColor="#64B9FF"
          _hover={{ bg: "#17374b" }}
          onClick={onBack}
        >
          Back
        </Button>
      )}

      {onNext && (
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
      )}
    </HStack>
  );
}
