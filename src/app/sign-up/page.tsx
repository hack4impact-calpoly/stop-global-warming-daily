"use client";
import { Box, VStack, Text, Field, Input, Button } from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import React, { useState } from "react";

export default function Page() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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

  const handleSubmit = (e: React.FormEvent) => {
    console.log("Current data!");
    console.log(`Name: ${firstName} + ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    e.preventDefault();

    // check for empty fields!

    if (!firstName || !lastName || !email || !password) {
      if (!firstName) {
        setFirstError("This field is required");
      }
      if (!lastName) {
        setLastError("This field is required");
      }
      if (!email) {
        setEmailError("This field is required");
      }
      if (!password) {
        setPasswordError("This field is required");
      }

      return;
    }
    return;
  };

  return (
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
                placeholder="Enter your email"
                variant="subtle"
                type="email"
                onChange={(e) => {
                  setEmailError("");
                  setEmail(e.target.value);
                }}
              />
              <Field.ErrorText>{emailError}</Field.ErrorText>
            </Field.Root>
            <Field.Root required invalid={passwordError != ""}>
              <Field.Label>
                Password <Field.RequiredIndicator />
              </Field.Label>
              <Input
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
          </VStack>
        </VStack>
      </Box>
    </>
  );
}
