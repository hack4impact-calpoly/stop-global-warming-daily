"use client";

import { HStack, Input } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Search", ariaLabel = "Search" }: SearchBarProps) {
  return (
    <HStack
      flex={1}
      h="74px"
      bg="white"
      borderRadius="full"
      px={6}
      boxShadow="0px 1px 8px rgba(89, 91, 98, 0.08)"
      border="1px solid #EEF0F2"
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        border="none"
        outline="none"
        fontSize="lg"
        _focusVisible={{ boxShadow: "none" }}
      />
      <LuSearch size={32} color="black" aria-hidden="true" />
    </HStack>
  );
}
