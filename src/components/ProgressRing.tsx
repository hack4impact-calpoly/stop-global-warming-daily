import { Box, Text, ProgressCircle, AbsoluteCenter } from "@chakra-ui/react";

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
        <ProgressCircle.ValueText fontSize="6xl" fontWeight="bold">
          {clampedPercent}%
        </ProgressCircle.ValueText>
      </AbsoluteCenter>
    </ProgressCircle.Root>
  );
}
