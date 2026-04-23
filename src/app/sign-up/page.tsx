"use client";
import { Box, VStack, Text, Field, Input, Button, HStack, Link, PinInput } from "@chakra-ui/react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OnboardingProgressBar from "@/components/OnboardingProgressBar";
import { PasswordInput } from "@/components/ui/password-input";

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

export default function Page() {
  // clerk hook
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  // for onboarding
  const STEPS = {
    WELCOME: 0,
    ACCOUNT: 1,
    VERIFY: 2,
    PERSONAL: 3,
    INTEREST: 4,
    PROFILE: 5,
    DONE: 6,
  } as const;
  type Step = (typeof STEPS)[keyof typeof STEPS];
  const [step, setStep] = useState<Step>(STEPS.WELCOME);

  // for verification
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const [codeError, setCodeError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [firstError, setFirstError] = useState<string>("");
  const [lastError, setLastError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const checkValidPassowrd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    if (e.target.value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else setConfirmPasswordError("");
    setPassword(e.target.value);
  };
  const checkConfirmPassowrd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else setConfirmPasswordError("");

    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // check to make sure we're loaded
    if (!isLoaded) {
      return;
    }

    // check for empty fields!
    if (!firstName || !lastName || !emailAddress || !password || !confirmPassword) {
      if (!firstName) setFirstError("This field is required");
      if (!lastName) setLastError("This field is required");
      if (!emailAddress) setEmailError("This field is required");
      if (!password) setPasswordError("This field is required");
      if (!confirmPassword) setConfirmPasswordError("This field is required");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    // try to connect to clerk!!

    try {
      await signUp.create({
        emailAddress,
      });

      // sent verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setStep(STEPS.VERIFY);
    } catch (err: any) {
      console.error("Clerk sign up error:", err);
      console.error("Clerk sign up error JSON:", JSON.stringify(err, null, 2));
      console.error(JSON.stringify(err, null, 2));
      let error = err.errors[0];
      if (error.code.includes("password")) {
        setPasswordError(error.longMessage);
      } else {
        setEmailError(error.longMessage);
      }
    }
    return;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    if (!isLoaded) return <div>Loading...</div>;

    // try the given code!
    try {
      console.log(code.join(""));
      const verifyAttempt = await signUp.attemptEmailAddressVerification({ code: code.join("") });

      // if complete, set session to active and redirect user
      if (verifyAttempt.status === "complete") {
        const data = {
          email: emailAddress,
          name: firstName + " " + lastName,
        };

        let res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        //Uncomment for pt2
        // setStep(STEPS.PERSONAL);

        await setActive({
          session: verifyAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.push("/");
          },
        });
      } else {
        setCodeError("Incorrect Code!");
        console.error("Sign up attempt not complete: ", verifyAttempt);
        console.error("Sign up attempt status:", verifyAttempt.status);
        setIsVerifying(false);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setIsVerifying(false);
    }
  };

  const onNext = async (e: React.FormEvent) => {
    if (step === STEPS.ACCOUNT) {
      await handleSubmit(e);
    } else if (step === STEPS.VERIFY) {
      await handleVerify(e);
    } else {
      setStep((prev) => (prev + 1) as Step);
    }
  };

  const onBack = () => {
    setStep((prev) => (prev - 1) as Step);
  };

  const showStep = (step: number) => {
    if (step === STEPS.WELCOME)
      return (
        <VStack w={"100%"} gap={10} px={10}>
          <VStack gap={5}>
            <Text fontSize="32px" color={"#057CC6"} fontWeight={"semibold"} textAlign={"center"} lineHeight={"39px"}>
              Build small habits. Make a real impact.
            </Text>

            <Text fontSize="24px" color={"#000000"} fontWeight={"semibold"} textAlign={"center"} lineHeight={"29px"}>
              Track simple daily actions that reduce your carbon footprint.
            </Text>
          </VStack>

          <Image
            src="/images/green-earth.svg"
            alt="Globe Image"
            width={500}
            height={500}
            style={{
              width: "100%",
              height: "auto",
            }}
          />

          <Button
            w={"100%"}
            px={10}
            py={6}
            h="50px"
            borderRadius={8}
            bg="#64B9FF"
            color="white"
            onClick={() => setStep(STEPS.ACCOUNT)}
          >
            Get Started
          </Button>
        </VStack>
      );
    else if (step === STEPS.ACCOUNT)
      return (
        <VStack display={"flex"} alignContent={"center"} w={"100%"} h={"100%"}>
          <Text fontSize="34px" fontWeight="semibold" color="#057CC6">
            Create An Account
          </Text>
          <HStack fontWeight={"medium"} fontSize={"16px"}>
            <Text color={"#3B3B3B"}>Already have an account?</Text>
            <Link href="/login">
              <Text color="#057CC6">Login</Text>
            </Link>
          </HStack>
          {/* Form information*/}
          <VStack display="flex" justifyContent="center" w="100%" gap={7} py={10} px={10}>
            <Field.Root required invalid={firstError != ""}>
              <Field.Label fontSize={16} fontWeight={"semibold"}>
                First Name
              </Field.Label>
              <Input
                value={firstName}
                placeholder="First Name"
                variant="subtle"
                onChange={(e) => {
                  setFirstError("");
                  setFirstName(e.target.value);
                }}
                borderRadius={12}
                borderColor={"#A9AEB1"}
                _placeholder={{ color: "#A9AEB1" }}
                bg={"none"}
                h={"35px"}
              />
              <Field.ErrorText>{firstError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={lastError != ""}>
              <Field.Label fontSize={16} fontWeight={"semibold"}>
                Last Name
              </Field.Label>
              <Input
                value={lastName}
                placeholder="Last Name"
                variant="subtle"
                onChange={(e) => {
                  setLastError("");
                  setLastName(e.target.value);
                }}
                borderRadius={12}
                borderColor={"#A9AEB1"}
                _placeholder={{ color: "#A9AEB1" }}
                bg={"none"}
                h={"35px"}
              />
              <Field.ErrorText>{lastError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={emailError != ""}>
              <Field.Label fontSize={16} fontWeight={"semibold"}>
                Email
              </Field.Label>
              <Input
                value={emailAddress}
                placeholder="example@gmail.com"
                variant="subtle"
                type="email"
                onChange={(e) => {
                  setEmailError("");
                  setEmailAddress(e.target.value);
                }}
                borderRadius={12}
                borderColor={"#A9AEB1"}
                _placeholder={{ color: "#A9AEB1" }}
                bg={"none"}
                h={"35px"}
              />
              <Field.ErrorText>{emailError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={passwordError != ""}>
              <Field.Label fontSize={16} fontWeight={"semibold"}>
                Create Password
              </Field.Label>
              <PasswordInput
                value={password}
                placeholder="At least 8 characters long"
                variant="subtle"
                onChange={checkValidPassowrd}
                type={showPassword ? "text" : "password"}
                borderRadius={12}
                borderColor={"#A9AEB1"}
                _placeholder={{ color: "#A9AEB1" }}
                bg={"none"}
                h={"35px"}
              />
              <Field.ErrorText>{passwordError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={confirmPasswordError != ""}>
              <Field.Label fontSize={16} fontWeight={"semibold"}>
                Confirm Password
              </Field.Label>
              <PasswordInput
                value={confirmPassword}
                placeholder="Re-enter your password"
                variant="subtle"
                onChange={checkConfirmPassowrd}
                type={showConfirmPassword ? "text" : "password"}
                borderRadius={12}
                borderColor={"#A9AEB1"}
                _placeholder={{ color: "#A9AEB1" }}
                bg={"none"}
                h={"35px"}
              />
              <Field.ErrorText>{confirmPasswordError}</Field.ErrorText>
            </Field.Root>
          </VStack>
        </VStack>
      );
    else if (step === STEPS.VERIFY)
      return (
        <VStack w="100%" h="100%" align="center" justify="center" gap="10">
          <VStack>
            <Text fontSize="34px" fontWeight="semibold" color="#057CC6" textAlign="center">
              Confirm Your Email
            </Text>
            <Text color="#3B3B3B" fontSize="16px" fontWeight="semibold" textAlign="center">
              Please enter the code send to <br />
              {emailAddress}.
            </Text>
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
              onValueChange={(e) => setCode(e.value)}
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
      );
  };

  return (
    <VStack display={"flex"} w={"100%"} h={"100%"} gap={0}>
      {/* Top Progress Bar */}
      <Box w="100%" px={7} pt={4} pb={2} mt={12} mb={12} h="8px">
        <Box hidden={step === STEPS.WELCOME || step === STEPS.DONE}>
          <OnboardingProgressBar currentStep={step} />
        </Box>
      </Box>

      {/* Content */}
      {showStep(step)}

      {/* Bottom Footer  */}
      <Box hidden={step === STEPS.WELCOME || step === STEPS.DONE}>
        <HStack position="absolute" bottom={10} left={0} right={0} h="80px" px={10} alignItems="center">
          <Box hidden={step === STEPS.ACCOUNT}>
            <Button
              variant="outline"
              px={10}
              py={7}
              borderRadius={8}
              bg="#F9FAFB"
              color="#64B9FF"
              borderColor={"#64B9FF"}
              _hover={{ bg: "#17374b" }}
              onClick={onBack}
            >
              Back
            </Button>
          </Box>

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
        </HStack>
      </Box>
    </VStack>
  );
}
