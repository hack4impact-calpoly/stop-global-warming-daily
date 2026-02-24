import * as React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type CalendarSwitchProps = BoxProps & {
  selected: boolean;
  onClick: () => void;
  label: string;
};

export default function CalendarSwitchButton({ selected, onClick, label, ...rest }: CalendarSwitchProps) {
  return (
    <Box
      w="30px"
      h="30px"
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      bg={selected ? "blue.400" : "transparent"}
      color="black"
      _hover={{
        bg: selected ? "#5C7DE0" : "DDE0EC",
      }}
      onClick={onClick}
      {...rest}
    >
      {label}
    </Box>
  );
}
