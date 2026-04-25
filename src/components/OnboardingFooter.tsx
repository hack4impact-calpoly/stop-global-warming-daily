"use client";

import { HStack, Button } from "@chakra-ui/react";

interface OnboardingFooterProps {
  onBack?: () => void;
  onNext?: () => void;
}

export default function OnboardingFooter({ onBack, onNext }: OnboardingFooterProps) {
  if (!onBack && !onNext) return null;

  return (
    <HStack as="footer" w="100%" h="80px" px={10} alignItems="center" mt="auto" flexShrink={0}>
      {onBack && (
        <Button
          variant="outline"
          p={"15px 40px"}
          h={"45px"}
          borderRadius={8}
          bg="#F9FAFB"
          color="#64B9FF"
          border={"1px solid #64B9FF"}
          onClick={onBack}
        >
          Back
        </Button>
      )}

      {onNext && (
        <Button
          ml="auto"
          p={"15px 40px"}
          h={"45px"}
          borderRadius={8}
          bg="#64B9FF"
          color="white"
          border={"1px solid #64B9FF"}
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </HStack>
  );
}
