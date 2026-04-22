"use client";
import { HStack, Box } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const FILLED_BG = "linear-gradient(130.74deg, #64B9FF 3.21%, #057CC6 96.79%)";
const EMPTY_BG = "#E8F1F8";

export default function OnboardingProgressBar({ currentStep, totalSteps = 5 }: OnboardingProgressBarProps) {
  return (
    <HStack w="100%" gap={2}>
      {Array.from({ length: totalSteps }).map((_, i) => {
        const filled = i < currentStep;
        return (
          <Box key={i} flex={1} h="8px" borderRadius="full" bg={EMPTY_BG} overflow="hidden" position="relative">
            <AnimatePresence>
              {filled && (
                <MotionBox
                  position="absolute"
                  inset={0}
                  borderRadius="full"
                  bg={FILLED_BG}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  style={{ transformOrigin: "left center" }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </AnimatePresence>
          </Box>
        );
      })}
    </HStack>
  );
}
