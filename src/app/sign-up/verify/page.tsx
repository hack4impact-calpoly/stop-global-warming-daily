"use client";
import { VStack, Text, Field, Button, HStack, PinInput } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import OnboardingFooter from "@/components/OnboardingFooter";

export default function Page() {
  // hooks
  const { isLoaded, signUp } = useSignUp(); //clerk
  const { user, step: currentStep, updateStep } = useNewUserFormContext(); //current step
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [codeError, setCodeError] = useState<string>("");
  const [isSendingAgain, setIsSendingAgain] = useState(false);

  const handleNext = async () => {
    if (!isLoaded) return;

    // try the given code!
    try {
      console.log(code.join(""));
      // const verifyAttempt = await signUp.attemptEmailAddressVerification({ code: code.join("") });

      // if verification correct then go to next screen
      // if (verifyAttempt.status === "missing_requirements" || verifyAttempt.status === "complete") {
      if (true) {
        updateStep(currentStep + 1);
        router.push("/sign-up/personalize");
      } else {
        setCodeError("Incorrect Code!");
        // console.error("Sign up attempt not complete: ", verifyAttempt);
        // console.error("Sign up attempt status:", verifyAttempt.status);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleBack = () => {
    updateStep(currentStep - 1);
    router.back();
  };

  const handleSendAgain = async () => {
    if (!isLoaded || !signUp) return;

    try {
      setIsSendingAgain(true);
      setCodeError("");

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      console.log("sent new code");

      setCode(["", "", "", "", "", ""]);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));

      setCodeError(
        err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Could not send a new code. Please try again.",
      );
    } finally {
      setIsSendingAgain(false);
    }
  };

  return (
    <>
      <VStack w="100%" h="100%" align="center" justify="center" gap="10">
        <VStack>
          <VStack gap={0}>
            <Text fontSize="34px" fontWeight="semibold" color="#057CC6" textAlign="center">
              Confirm Your Email
            </Text>
            <Text color="#3B3B3B" fontSize="16px" fontWeight="semibold" textAlign="center">
              Enter the code sent to <br />
              {user?.email}
            </Text>
          </VStack>
          <HStack fontWeight="medium" fontSize="16px" justify="center">
            <Text color="#3B3B3B">Didn&apos;t get a code?</Text>
            <Text
              onClick={isSendingAgain ? undefined : handleSendAgain}
              color="#057CC6"
              cursor={isSendingAgain ? "not-allowed" : "pointer"}
              opacity={isSendingAgain ? 0.6 : 1}
            >
              {isSendingAgain ? "Sending..." : "Send Again"}
            </Text>
          </HStack>
        </VStack>

        <Field.Root
          required
          invalid={codeError !== ""}
          display="flex"
          flexDirection="column"
          alignItems="center"
          w="100%"
        >
          <PinInput.Root
            otp
            type="numeric"
            count={6}
            value={code}
            placeholder=""
            fontSize="16px"
            onValueChange={(e) => {
              setCode(e.value);
              setCodeError("");
            }}
          >
            <PinInput.HiddenInput />
            <PinInput.Control display="flex" justifyContent="center" alignItems="center" gap="10px" mx="auto">
              <PinInput.Input index={0} {...pinStyles} />
              <PinInput.Input index={1} {...pinStyles} />
              <PinInput.Input index={2} {...pinStyles} />
              <PinInput.Input index={3} {...pinStyles} />
              <PinInput.Input index={4} {...pinStyles} />
              <PinInput.Input index={5} {...pinStyles} />
            </PinInput.Control>
          </PinInput.Root>

          <Field.ErrorText textAlign="center">{codeError}</Field.ErrorText>
        </Field.Root>
      </VStack>
      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </>
  );
}

//Styles
const pinStyles = {
  w: "37px",
  h: "53px",
  bg: "#E8F1F8",
  border: "2px solid #64B9FF",
  borderRadius: "12px",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "24px",

  _placeholder: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: "24px",
    lineHeight: "29px",
    textAlign: "center",
    color: "#000000",
  },
};
