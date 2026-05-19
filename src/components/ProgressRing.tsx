import { ProgressCircle, AbsoluteCenter, Image } from "@chakra-ui/react";

export default function ProgressRing({ percent = 0, isClockwise = true, size = "270px", thickness = "30px" }) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <ProgressCircle.Root value={clampedPercent}>
      <ProgressCircle.Circle
        style={
          {
            "--size": size,
            "--thickness": thickness,
            transform: isClockwise ? "none" : "scaleX(-1)",
          } as React.CSSProperties
        }
      >
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#057CC6" />
            <stop offset="100%" stopColor="#64B9FF" />
          </linearGradient>
        </defs>
        <ProgressCircle.Track stroke="#E8F1F8" />
        <ProgressCircle.Range stroke="url(#progress-gradient)" strokeLinecap="round" />
      </ProgressCircle.Circle>

      <AbsoluteCenter>
        <Image src="/images/flame.svg" alt="streak-flame" h={75} w={70} />
      </AbsoluteCenter>
    </ProgressCircle.Root>
  );
}
