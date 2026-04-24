"use client";
import { Box, VStack } from "@chakra-ui/react";
import OnboardingProgressBar from "@/components/OnboardingProgressBar";
import { UserFormContextProvider } from "@/lib/context/sign-up";
import { usePathname, redirect } from "next/navigation";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
const steps = ["/sign-up/", "/sign-up/step1", "/sign-up/step2", "/sign-up/step3", "/sign-up/step4", "/sign-up/step5"];

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { step: currentStep } = useNewUserFormContext();
  const pathname = usePathname();
  const routeStep = Math.max(steps.indexOf(pathname), 0);
  const isProgressHidden = routeStep === 0;

  if (routeStep > 0 && currentStep === 0) {
    redirect("/sign-up");
  }

  return (
    <VStack display={"flex"} w={"100%"} h={"100%"} gap={0}>
      {/* Top Progress Bar */}
      <Box w="100%" px={7} pt={4} pb={2} mb={10} h="8px">
        <Box hidden={isProgressHidden}>
          <OnboardingProgressBar currentStep={routeStep} />
        </Box>
      </Box>

      {/* Content */}
      {children}
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
