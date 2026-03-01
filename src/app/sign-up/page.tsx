"use client";
import { Box, VStack, Text, Field, Input, Button, HStack, Link } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import React, { useState } from "react";
import { SignUp, useSignUp } from "@clerk/nextjs";
import { verify } from "crypto";
import { setDragLock } from "framer-motion";
import { useRouter } from "next/navigation";
import { IUsers } from "@/database/userSchema";

// TODO: add link to login page
// TODO: if user is signed in already, do not let them access

export default function Page() {
  // clerk hook
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // for verification
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [firstError, setFirstError] = useState<string>("");
  const [lastError, setLastError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const checkValidPassowrd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // check to make sure we're loaded
    if (!isLoaded) {
      return;
    }

    // check for empty fields!

    if (!firstName || !lastName || !emailAddress || !password) {
      if (!firstName) {
        setFirstError("This field is required");
      }
      if (!lastName) {
        setLastError("This field is required");
      }
      if (!emailAddress) {
        setEmailError("This field is required");
      }
      if (!password) {
        setPasswordError("This field is required");
      }

      return;
    }

    // try to connect to clerk!!

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // sent verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err: any) {
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
      console.log(code);
      const verifyAttempt = await signUp.attemptEmailAddressVerification({ code });

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

  return !verifying ? (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <VStack maxW="345px" w="full" gap={2} px={3} py={3}>
          <Text fontSize="34px" fontWeight="semibold" color="black">
            Sign Up
          </Text>
          {/* Form information*/}
          <VStack display="flex" justifyContent="center" py={10} w="100%" gap={5}>
            <Field.Root required invalid={firstError != ""}>
              <Field.Label>
                First Name <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={firstName}
                placeholder="First Name"
                variant="subtle"
                onChange={(e) => {
                  setFirstError("");
                  setFirstName(e.target.value);
                }}
              />
              <Field.ErrorText>{firstError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={lastError != ""}>
              <Field.Label>
                Last Name <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={lastName}
                placeholder="Last Name"
                variant="subtle"
                onChange={(e) => {
                  setLastError("");
                  setLastName(e.target.value);
                }}
              />
              <Field.ErrorText>{lastError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={emailError != ""}>
              <Field.Label>
                Email <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={emailAddress}
                placeholder="Enter your email"
                variant="subtle"
                type="email"
                onChange={(e) => {
                  setEmailError("");
                  setEmailAddress(e.target.value);
                }}
              />
              <Field.ErrorText>{emailError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={passwordError != ""}>
              <Field.Label>
                Password <Field.RequiredIndicator />
              </Field.Label>
              <Input
                value={password}
                placeholder="Enter a password"
                variant="subtle"
                onChange={checkValidPassowrd}
                type={showPassword ? "text" : "password"}
              />
              <Button
                onClick={toggleShowPassword}
                position="absolute"
                bg="transparent"
                color="black"
                right="0"
                transform="translateY(65%)"
              >
                <FaEye size={20} />
              </Button>
              <Field.ErrorText>{passwordError}</Field.ErrorText>
            </Field.Root>
            <Field.Root py={5}>
              <Button width="full" bg="#296184" color="white" _hover={{ bg: "#17374b" }} onClick={handleSubmit}>
                Create Account
              </Button>
            </Field.Root>
            <HStack>
              <Text>Already have an account?</Text>
              <Link href="/login">
                <Text color="#296184">Login</Text>
              </Link>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </>
  ) : (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <VStack maxW="345px" w="full" gap={2} px={3} py={3}>
          <Text fontSize="34px" fontWeight="semibold" color="black">
            Verifying
          </Text>
          <VStack display="flex" justifyContent="center" py={10} w="100%" gap={3}>
            <Field.Root required invalid={codeError != ""}>
              <Field.Label fontSize="20px" py={3}>
                Please enter the code send to {emailAddress}.
              </Field.Label>
              <Input
                value={code}
                placeholder="Code"
                variant="subtle"
                onChange={(e) => {
                  setCodeError("");
                  setCode(e.target.value);
                }}
              />
              <Field.ErrorText>{codeError}</Field.ErrorText>
            </Field.Root>
            <Field.Root>
              <Button
                loading={isVerifying}
                width="full"
                bg="#296184"
                color="white"
                _hover={{ bg: "#17374b" }}
                onClick={handleVerify}
              >
                Verify
              </Button>
            </Field.Root>
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
