"use client";
import { VStack, Text, Field, Button, HStack, PinInput } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

export default function Page() {
  // hooks
  const { isLoaded, signUp } = useSignUp(); //clerk
  const { user, step: currentStep, updateStep } = useNewUserFormContext(); //current step
  const router = useRouter();
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [codeError, setCodeError] = useState<string>("");

  const onNext = async () => {
    if (!isLoaded) return;

    // try the given code!
    try {
      console.log(code.join(""));
      // const verifyAttempt = await signUp.attemptEmailAddressVerification({ code: code.join("") });

      // if verification correct then go to next screen
      // if (verifyAttempt.status === "missing_requirements" || verifyAttempt.status === "complete") {
      if (true) {
        updateStep(currentStep + 1);
        router.push("/sign-up/step3/");
      } else {
        setCodeError("Incorrect Code!");
        // console.error("Sign up attempt not complete: ", verifyAttempt);
        // console.error("Sign up attempt status:", verifyAttempt.status);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onBack = () => {
    updateStep(currentStep - 1);
    router.back();
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
            <Text color="#3B3B3B">Didn’t get a code?</Text>
            <Text onClick={() => null} color="#057CC6" cursor="pointer">
              Send Again
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
      <HStack position="absolute" bottom={10} left={0} right={0} h="80px" px={10} alignItems="center">
        <Button
          variant="outline"
          px={10}
          py={6}
          borderRadius={8}
          bg="#F9FAFB"
          color="#64B9FF"
          borderColor={"#64B9FF"}
          _hover={{ bg: "#17374b" }}
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          ml="auto"
          px={10}
          py={6}
          borderRadius={8}
          bg="#64B9FF"
          color="white"
          _hover={{ bg: "#17374b" }}
          onClick={onNext}
        >
          Next
        </Button>
      </HStack>
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
