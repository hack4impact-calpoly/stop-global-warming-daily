"use client";
import { VStack, SimpleGrid, Text, Box, Image } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingFooter from "@/components/OnboardingFooter";
import { LuCheck } from "react-icons/lu";
import { useSignUp } from "@clerk/nextjs";

const AVATARS: string[] = [
  "/images/profile-pictures/profile-picture-1.svg",
  "/images/profile-pictures/profile-picture-2.svg",
  "/images/profile-pictures/profile-picture-3.svg",
  "/images/profile-pictures/profile-picture-4.svg",
  "/images/profile-pictures/profile-picture-5.svg",
  "/images/profile-pictures/profile-picture-6.svg",
  "/images/profile-pictures/profile-picture-7.svg",
  "/images/profile-pictures/profile-picture-8.svg",
];

export default function Page() {
  const { step: currentStep, updateStep, user: savedUser, updateUserData } = useNewUserFormContext();
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [selected, setSelected] = useState<string>(savedUser?.picture ?? "");

  const handleNext = async () => {
    // check to make sure we're loaded
    if (!isLoaded) {
      return;
    }

    try {
      //finish sign up and now complete
      await signUp.update({
        firstName: savedUser?.firstname,
        lastName: savedUser?.lastname,
      });

      // if complete, set session to active and redirect user
      if (signUp.status === "complete") {
        const data = {
          email: savedUser?.email,
          name: savedUser?.firstname + " " + savedUser?.lastname,
          birthday: savedUser?.birthday,
          locationName: savedUser?.locationName,
          locationCoordinates: savedUser?.locationCoordinates,
          interests: savedUser?.interests,
          focuses: savedUser?.focuses ?? [],
          picture: selected,
        };

        let res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        await setActive({
          session: signUp.createdSessionId,
        });

        updateUserData({ picture: selected });
        updateStep(currentStep + 1);
        router.push("/sign-up/done");
      } else {
        console.error("Sign up attempt not complete: ", signUp);
        console.error("Sign up attempt status:", signUp.status);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleBack = () => {
    updateStep(currentStep - 1);
    router.back();
  };

  return (
    <VStack w="100%" flex="1" align="stretch" gap={0} pb={10}>
      <VStack w="100%" flex="1" align="center" justify="flex-start" gap={8} px={10}>
        <Text fontSize="24px" lineHeight="29px" fontWeight="semibold" color="#057CC6" textAlign="center" w="100%">
          Choose your profile picture!
        </Text>

        <SimpleGrid columns={4} gap={4} w="100%">
          {AVATARS.map((src) => {
            const isSelected = selected === src;
            return (
              <Box
                key={src}
                position="relative"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                onClick={() => setSelected(src)}
              >
                <Box
                  w="73px"
                  h="73px"
                  borderRadius="full"
                  overflow="hidden"
                  border={isSelected ? "2px solid #64B9FF" : "2.5px solid transparent"}
                  transition="border 0.15s ease"
                  bg="#E8F1F8"
                >
                  {/* IMAGE GOES HERE */}
                  <Image src={src} alt={`Avatar option`} w="100%" h="100%" objectFit="cover" />
                </Box>

                {isSelected && (
                  <Box
                    position="absolute"
                    top={"0px"}
                    right="5px"
                    w="20px"
                    h="20px"
                    borderRadius="full"
                    bg="#64B9FF"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <LuCheck color="#000000" />
                  </Box>
                )}
              </Box>
            );
          })}
        </SimpleGrid>
      </VStack>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </VStack>
  );
}
