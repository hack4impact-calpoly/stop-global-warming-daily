import { Box } from "@chakra-ui/react";
import Calendar from "@/components/Calendar";
export default function Page() {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Calendar></Calendar>
    </Box>
  );
}
