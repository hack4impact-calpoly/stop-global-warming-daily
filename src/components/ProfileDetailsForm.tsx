"use client";

import { Box, Field, HStack, IconButton, Input, NativeSelect, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { IoMdPin } from "react-icons/io";
import { findLocation, LocationCoordinates } from "@/lib/findLocation";

export type ProfileDetailsValue = {
  birthday?: Date;
  locationName: string;
  locationCoordinates: LocationCoordinates;
};

type ProfileDetailsFormProps = {
  value: ProfileDetailsValue;
  onChange: (value: ProfileDetailsValue) => void;
  errors?: {
    birthday?: string;
    location?: string;
  };
  onClearError?: (field: "birthday" | "location") => void;
};

export default function ProfileDetailsForm({ value, onChange, errors, onClearError }: ProfileDetailsFormProps) {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    const birthdayDate = value.birthday ? new Date(value.birthday) : null;

    setMonth(birthdayDate ? String(birthdayDate.getMonth() + 1) : "");
    setDay(birthdayDate ? String(birthdayDate.getDate()) : "");
    setYear(birthdayDate ? String(birthdayDate.getFullYear()) : "");
  }, [value.birthday]);

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

  const updateBirthday = (newMonth: string, newDay: string, newYear: string) => {
    setMonth(newMonth);
    setDay(newDay);
    setYear(newYear);
    onClearError?.("birthday");

    const birthday =
      newMonth && newDay && newYear ? new Date(Number(newYear), Number(newMonth) - 1, Number(newDay)) : undefined;

    onChange({
      ...value,
      birthday,
    });
  };

  const handleFetchLocation = async () => {
    if (isFetchingLocation) return;

    if (!value.locationName.trim()) {
      setLocationError("Please enter a city.");
      return;
    }

    try {
      setLocationError("");
      onClearError?.("location");
      setIsFetchingLocation(true);

      const result = await findLocation(value.locationName);

      if (!result) {
        setLocationError("Could not find that location.");
        return;
      }

      onChange({
        ...value,
        locationName: result.locationName,
        locationCoordinates: result.locationCoordinates,
      });
    } catch (err) {
      console.error(err);
      setLocationError("Something went wrong while finding your location.");
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const birthdayError = errors?.birthday || "";
  const shownLocationError = errors?.location || locationError;

  return (
    <VStack w="100%" gap={4} align="stretch">
      <Field.Root required invalid={birthdayError !== ""}>
        <VStack align="start" gap={2} w="100%">
          <Field.Label fontSize="16px" fontWeight="semibold">
            Birthday
          </Field.Label>

          <HStack w="100%" gap={2}>
            <NativeSelect.Root flex="1">
              <NativeSelect.Field
                value={month}
                onChange={(e) => updateBirthday(e.target.value, day, year)}
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
                onChange={(e) => updateBirthday(month, e.target.value, year)}
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
                onChange={(e) => updateBirthday(month, day, e.target.value)}
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

          <Field.ErrorText>{birthdayError}</Field.ErrorText>
        </VStack>
      </Field.Root>

      <Field.Root required invalid={shownLocationError !== ""}>
        <VStack align="start" gap={2} w="100%">
          <Field.Label fontSize="16px" fontWeight="semibold">
            Location
          </Field.Label>

          <Box position="relative" w="100%">
            <Input
              value={value.locationName}
              onChange={(e) => {
                onClearError?.("location");
                setLocationError("");

                onChange({
                  ...value,
                  locationName: e.target.value,
                  locationCoordinates: [],
                });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFetchLocation();
                }
              }}
              placeholder="Type your city or use your current location"
              h="35px"
              p="10px 15px"
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

          <Field.ErrorText>{shownLocationError}</Field.ErrorText>
        </VStack>
      </Field.Root>
    </VStack>
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
