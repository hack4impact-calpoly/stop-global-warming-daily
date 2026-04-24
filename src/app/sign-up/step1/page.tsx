"use client";
import { Box, VStack, Text, Field, Input, Button, HStack, Link } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { accountSchema } from "@/lib/formSchemas/accountSchema";
import z from "zod";

export default function Page() {
  const { isLoaded, signUp } = useSignUp();
  //Context for all pages
  const { user: savedUser, updateUserData, step: currentStep, updateStep } = useNewUserFormContext();
  const router = useRouter();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onNext = async () => {
    if (!isLoaded) return;
    // reset all errors
    setErrors({ firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });

    //check schema
    const result = accountSchema.safeParse({
      firstname: savedUser?.firstname ?? "",
      lastname: savedUser?.lastname ?? "",
      email: savedUser?.email ?? "",
      password: savedUser?.password ?? "",
      confirmPassword,
    });

    // If there are any errors set them
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors({
        firstname: fieldErrors.firstname?.[0] || "",
        lastname: fieldErrors.lastname?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
        confirmPassword: fieldErrors.confirmPassword?.[0] || "",
      });
      return;
    }

    // try to connect to clerk!!
    try {
      // await signUp.create({
      //   emailAddress: result.data.email,
      // });

      // // send verification code
      // await signUp.prepareEmailAddressVerification({
      //   strategy: "email_code",
      // });
      updateStep(currentStep + 1);
      router.push("/sign-up/step2");
    } catch (err: any) {
      console.error("Clerk sign up error:", err);

      const error = err.errors?.[0];

      if (error?.code?.includes("password")) {
        setErrors((prev) => ({ ...prev, password: error.longMessage || "Invalid password." }));
      } else {
        setErrors((prev) => ({ ...prev, email: error?.longMessage || "Something went wrong." }));
      }
    }
  };

  return (
    <>
      <VStack display="flex" alignContent="center" w="100%" h="100%" gap={7}>
        <VStack gap={0}>
          <Text fontSize="34px" fontWeight="semibold" color="#057CC6">
            Create An Account
          </Text>

          <HStack fontWeight="medium" fontSize="16px">
            <Text color="#3B3B3B">Already have an account?</Text>
            <Link href="/login">
              <Text color="#057CC6">Login</Text>
            </Link>
          </HStack>
        </VStack>

        <VStack w="100%" px={10} gap={4} align="stretch">
          <Field.Root required invalid={errors.firstname !== ""}>
            <Field.Label fontSize={16} fontWeight="semibold">
              First Name
            </Field.Label>
            <Input
              value={savedUser?.firstname || ""}
              placeholder="First Name"
              variant="subtle"
              fontSize="16px"
              onChange={(e) => {
                updateUserData({ firstname: e.target.value });
              }}
              borderRadius={12}
              borderColor="#A9AEB1"
              _placeholder={{ color: "#A9AEB1", fontSize: "12px" }}
              bg="none"
              h="35px"
            />
            <Field.ErrorText minH="20px">{errors.firstname}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={errors.lastname !== ""}>
            <Field.Label fontSize={16} fontWeight="semibold">
              Last Name
            </Field.Label>
            <Input
              value={savedUser?.lastname || ""}
              placeholder="Last Name"
              variant="subtle"
              fontSize="16px"
              onChange={(e) => updateUserData({ lastname: e.target.value })}
              borderRadius={12}
              borderColor="#A9AEB1"
              _placeholder={{ color: "#A9AEB1", fontSize: "12px" }}
              bg="none"
              h="35px"
            />
            <Field.ErrorText>{errors.lastname}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={errors.email !== ""}>
            <Field.Label fontSize={16} fontWeight="semibold">
              Email
            </Field.Label>
            <Input
              value={savedUser?.email || ""}
              placeholder="example@gmail.com"
              variant="subtle"
              type="email"
              fontSize="16px"
              onChange={(e) => updateUserData({ email: e.target.value })}
              borderRadius={12}
              borderColor="#A9AEB1"
              _placeholder={{ color: "#A9AEB1", fontSize: "12px" }}
              bg="none"
              h="35px"
            />
            <Field.ErrorText>{errors.email}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={errors.password !== ""}>
            <Field.Label fontSize={16} fontWeight="semibold">
              Create Password
            </Field.Label>
            <PasswordInput
              value={savedUser?.password || ""}
              placeholder="At least 8 characters long"
              variant="subtle"
              fontSize="16px"
              onChange={(e) => updateUserData({ password: e.target.value })}
              borderRadius={12}
              borderColor="#A9AEB1"
              _placeholder={{ color: "#A9AEB1", fontSize: "12px" }}
              bg="none"
              h="35px"
            />
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={errors.confirmPassword !== ""}>
            <Field.Label fontSize={16} fontWeight="semibold">
              Confirm Password
            </Field.Label>
            <PasswordInput
              value={confirmPassword}
              placeholder="Re-enter your password"
              variant="subtle"
              fontSize="16px"
              onChange={(e) => {
                setErrors((prev) => ({
                  ...prev,
                  confirmPassword: "",
                }));
                setConfirmPassword(e.target.value);
              }}
              borderRadius={12}
              borderColor="#A9AEB1"
              _placeholder={{ color: "#A9AEB1", fontSize: "12px" }}
              bg="none"
              h="35px"
            />
            <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
          </Field.Root>
        </VStack>
      </VStack>

      <Box>
        <HStack position="absolute" bottom={10} left={0} right={0} h="80px" px={10} alignItems="center">
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
      </Box>
    </>
  );
}
