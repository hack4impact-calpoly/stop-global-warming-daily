import { Box, Text, ProgressCircle, AbsoluteCenter, Icon } from "@chakra-ui/react";
import { FaFire } from "react-icons/fa";

//// Custom progress ring component configurable with size, thickness, and direction of progress indicator
export default function ProgressRing({ percent = 0, isClockwise = true, size = "270px", thickness = "30px" }) {
  // Clamp to 0 to 100 range
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <ProgressCircle.Root value={clampedPercent} colorPalette={"cyan"}>
      <ProgressCircle.Circle
        style={
          {
            "--size": size,
            "--thickness": thickness,
            transform: isClockwise ? "none" : "scaleX(-1)",
          } as React.CSSProperties
        }
      >
        <ProgressCircle.Track />
        <ProgressCircle.Range strokeLinecap="round" />
      </ProgressCircle.Circle>
      <AbsoluteCenter>
        <Icon as={FaFire} boxSize={16} color="cyan.600" />
      </AbsoluteCenter>
    </ProgressCircle.Root>
  );
}
