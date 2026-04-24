"use client";

import { Box, Field, HStack, IconButton, Input, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { useNewUserFormContext } from "@/lib/hooks/sign-up";
import { useRouter } from "next/navigation";
import OnboardingFooter from "@/components/OnboardingFooter";
import { useEffect, useMemo, useState } from "react";
import { personalizeSchema } from "@/lib/formSchemas/personalizeSchema";
import z from "zod";
import { IoMdPin } from "react-icons/io";

export default function Page() {
  const { user: savedUser, updateUserData, step: currentStep, updateStep } = useNewUserFormContext();
  const [errors, setErrors] = useState({
    birthday: "",
    location: "",
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const birthdayDate = savedUser?.birthday ? new Date(savedUser?.birthday) : null;

  const [month, setMonth] = useState(birthdayDate ? String(birthdayDate.getMonth() + 1) : "");
  const [day, setDay] = useState(birthdayDate ? String(birthdayDate.getDate()) : "");
  const [year, setYear] = useState(birthdayDate ? String(birthdayDate.getFullYear()) : "");

  const months = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return Array.from({ length: 121 }, (_, index) => {
      return String(currentYear - index);
    });
  }, []);

  const days = useMemo(() => {
    if (!month) {
      return Array.from({ length: 31 }, (_, index) => String(index + 1));
    }

    const selectedYear = year ? Number(year) : new Date().getFullYear();
    const daysInMonth = new Date(selectedYear, Number(month), 0).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => String(index + 1));
  }, [month, year]);

  const router = useRouter();

  const handleFetchLocation = async () => {
    if (isFetchingLocation) return;

    if (!savedUser?.locationName?.trim()) {
      setErrors((prev) => ({ ...prev, location: "Please enter a city." }));
      return;
    }

    try {
      setErrors((prev) => ({ ...prev, location: "" }));
      setIsFetchingLocation(true);

      const params = new URLSearchParams({
        q: savedUser?.locationName,
        format: "json",
        addressdetails: "1",
        limit: "1",
      });

      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);

      const data = await res.json();

      if (!res.ok || data.length === 0) {
        setErrors((prev) => ({ ...prev, location: "Could not find that location." }));
        return;
      }

      const result = data[0];

      const city =
        result.address?.city ||
        result.address?.town ||
        result.address?.village ||
        result.address?.county ||
        savedUser?.locationName;

      const state = result.address?.state || "";
      const country = result.address?.country || "";

      const cleanName = [city, state || country].filter(Boolean).join(", ");

      const lat = Number(result.lat);
      const lng = Number(result.lon);

      updateUserData({ locationName: cleanName, locationCoordinates: [lng, lat] });
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, location: "Something went wrong while finding your location." }));
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleNext = async () => {
    setErrors({
      birthday: "",
      location: "",
    });

    const birthday = month && day && year ? new Date(Number(year), Number(month) - 1, Number(day)) : undefined;

    const result = personalizeSchema.safeParse({
      birthday,
      locationName: savedUser?.locationName ?? "",
      locationCoordinates: savedUser?.locationCoordinates ?? [],
    });

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;

      setErrors({
        birthday: fieldErrors.birthday?.[0] || "",
        location: fieldErrors.locationName?.[0] || fieldErrors.locationCoordinates?.[0] || "",
      });

      return;
    }

    try {
      updateUserData({
        birthday: result.data.birthday,
        locationName: result.data.locationName,
        locationCoordinates: result.data.locationCoordinates,
      });

      updateStep(currentStep + 1);
      router.push("/sign-up/interests");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleBack = () => {
    updateStep(currentStep - 2);
    router.push("/sign-up/account");
  };

  return (
    <>
      <VStack w="100%" h="100%" align="center" justify="center" gap="10" px={10}>
        <VStack>
          <VStack gap={0}>
            <Text fontSize="24px" lineHeight="29px" fontWeight="600" color="#057CC6" textAlign="start">
              We&apos;ll personalize tasks and local resources for you.
            </Text>

            <HStack fontWeight="medium" fontSize="16px" hidden>
              <Text color="#3B3B3B">Already have an account?</Text>
              <Text color="#057CC6">Login</Text>
            </HStack>
          </VStack>
        </VStack>

        <VStack w="100%" gap={4} align="stretch">
          <Field.Root required invalid={errors.birthday !== ""}>
            <VStack align="start" gap={2} w="100%">
              <Field.Label fontWeight="semibold">Birthday</Field.Label>

              <HStack w="100%" gap={2}>
                <NativeSelect.Root flex="1">
                  <NativeSelect.Field
                    value={month}
                    onChange={(e) => {
                      setMonth(e.target.value);
                      setErrors((prev) => ({ ...prev, birthday: "" }));
                    }}
                    {...pickerStyles}
                    color={month ? "#3B3B3B" : "#A9AEB1"}
                  >
                    <option value="" disabled>
                      Month
                    </option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <NativeSelect.Root flex=".6">
                  <NativeSelect.Field
                    value={day}
                    onChange={(e) => {
                      setDay(e.target.value);
                      setErrors((prev) => ({ ...prev, birthday: "" }));
                    }}
                    {...pickerStyles}
                    color={day ? "#3B3B3B" : "#A9AEB1"}
                  >
                    <option value="" disabled>
                      Day
                    </option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <NativeSelect.Root flex="1">
                  <NativeSelect.Field
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      setErrors((prev) => ({ ...prev, birthday: "" }));
                    }}
                    {...pickerStyles}
                    color={year ? "#3B3B3B" : "#A9AEB1"}
                  >
                    <option value="" disabled>
                      Year
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </HStack>
              <Field.ErrorText>{errors.birthday}</Field.ErrorText>
            </VStack>
          </Field.Root>

          <Field.Root required invalid={errors.location !== ""}>
            <VStack align="start" gap={2} w="100%">
              <Field.Label fontWeight="semibold">Location</Field.Label>

              <Box position="relative" w="100%">
                <Input
                  value={savedUser?.locationName || ""}
                  onChange={(e) => {
                    updateUserData({
                      locationName: e.target.value,
                      locationCoordinates: [],
                    });

                    setErrors((prev) => ({
                      ...prev,
                      location: "",
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleFetchLocation();
                    }
                  }}
                  placeholder="Type your city or use your current location"
                  h="35px"
                  alignItems="center"
                  p="10px 15px"
                  boxSizing="border-box"
                  bg="#F9FAFB"
                  border="1px solid #A9AEB1"
                  borderRadius="12px"
                  fontSize="16px"
                  pr="42px"
                  _placeholder={{
                    color: "#A9AEB1",
                    fontSize: "12px",
                  }}
                />

                <IconButton
                  aria-label="Find location"
                  position="absolute"
                  right="6px"
                  top="50%"
                  transform="translateY(-50%)"
                  variant="ghost"
                  loading={isFetchingLocation}
                  onClick={handleFetchLocation}
                >
                  <IoMdPin size={20} />
                </IconButton>
              </Box>

              <Field.ErrorText>{errors.location}</Field.ErrorText>
            </VStack>
          </Field.Root>
        </VStack>
      </VStack>

      <OnboardingFooter onBack={handleBack} onNext={handleNext} />
    </>
  );
}
const pickerStyles = {
  px: "10px",
  gap: "10px",
  h: "35px",
  bg: "#E8F1F8",
  border: "1px solid #A9AEB1",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "400",
};
