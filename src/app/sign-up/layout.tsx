"use client";
import { Box, VStack } from "@chakra-ui/react";
import OnboardingProgressBar from "@/components/OnboardingProgressBar";
import { UserFormContextProvider } from "@/lib/context/sign-up";
import { usePathname, redirect } from "next/navigation";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
const steps = [
  "/sign-up/",
  "/sign-up/account",
  "/sign-up/verify",
  "/sign-up/personalize",
  "/sign-up/interests",
  "/sign-up/select-profile",
  "/sign-up/done",
];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { step: currentStep } = useNewUserFormContext();
  const pathname = usePathname();
  const routeStep = Math.max(steps.indexOf(pathname), 0);
  const isProgressHidden = routeStep === 0 || routeStep === 6;

  if (routeStep > 0 && currentStep === 0) {
    redirect("/sign-up");
  }

  return (
    <VStack w="100%" minH="100dvh" gap={0} align="stretch">
      {/* Top Progress Bar */}
      <Box w="100%" px={7} pt={4} pb={4} mb={10} flexShrink={0}>
        <Box hidden={isProgressHidden}>
          <OnboardingProgressBar currentStep={routeStep} />
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        as="main"
        w="100%"
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="stretch"
      >
        {children}
      </Box>
    </VStack>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserFormContextProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserFormContextProvider>
  );
}
