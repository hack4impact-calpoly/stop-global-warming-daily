"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Box, VStack, Text, Field, Input, Button, HStack, Link } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    if (!password || !emailAddress) {
      if (!password) {
        setPasswordError("Please enter an email address");
        return;
      } else {
        setEmailError("Please enter a password");
        return;
      }
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session?.currentTask);
              return;
            }
            router.push("/");
          },
        });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setPasswordError("Incorrect Login");
        return;
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      setPasswordError("Incorrect Login");
    }

    return;
  };

  return (
    <>
      <Box display={"flex"} justifyContent={"center"}>
        <VStack maxW="345px" w="full" gap={2} px={3} py={3}>
          <Text fontSize="34px" fontWeight="semibold" color="black">
            Login
          </Text>
          {/* Form information*/}
          <VStack display="flex" justifyContent="center" py={10} w="100%" gap={5}>
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
                placeholder="Enter your password"
                variant="subtle"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                type={showPassword ? "text" : "password"}
              />
              <Button
                onClick={(e) => setShowPassword(!showPassword)}
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
                Login
              </Button>
            </Field.Root>
            <HStack>
              <Text>Don&apos;t have an account?</Text>
              <Link href="/sign-up">
                <Text color="#296184">Sign up</Text>
              </Link>
            </HStack>
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
