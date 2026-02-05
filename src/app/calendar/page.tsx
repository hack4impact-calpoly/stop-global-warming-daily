import { Box } from "@chakra-ui/react";
import MonthlyCalendar from "@/components/MonthlyCalendar";
export default function Page() {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <MonthlyCalendar></MonthlyCalendar>
    </Box>
  );
}
