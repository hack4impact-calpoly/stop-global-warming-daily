"use client";
import { useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { LuCheck, LuX } from "react-icons/lu";
import TaskCard from "@/components/TaskCard";

interface SwipeableTaskCardProps {
  date: Date;
  title: string;
  description: string;
  minEstimate: number;
  completed: boolean;
  onSwipeRight: () => void; // marks complete
  onSwipeLeft: () => void; // mark incomplete
}

const SWIPE_THRESHOLD = 80; // How far the user needs to swipe to trigger the action
const MAX_DRAG = 100; // The furthest the card is allowed to travel while dragging

export default function SwipeableTaskCard({
  date,
  title,
  description,
  minEstimate,
  completed,
  onSwipeRight,
  onSwipeLeft,
}: SwipeableTaskCardProps) {
  // How far the card has moved horizontally
  const [dragX, setDragX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startXRef = useRef<number | null>(null); // Where the user first touched/clicked
  const isDraggingRef = useRef(false);
  const completedAtSwipeStart = useRef(completed);

  // Gets a horizontal position of the pointer when user touches
  const getClientX = (e: React.TouchEvent | React.MouseEvent): number => {
    if ("touches" in e) return e.touches[0].clientX;
    return (e as React.MouseEvent).clientX;
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    completedAtSwipeStart.current = completed;
    startXRef.current = getClientX(e);
    isDraggingRef.current = true;
    setIsAnimating(false);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    // ignore if we're not in a drag or if the start position was never set
    if (!isDraggingRef.current || startXRef.current === null) return;
    // how far pointer moved where it started
    const dist = getClientX(e) - startXRef.current;
    // only allow swiping in the direction that makes sense
    if (completed && dist > 0) return;
    if (!completed && dist < 0) return;

    // clamp drag distance
    const clamped = dist > 0 ? Math.min(dist, MAX_DRAG) : Math.max(dist, -MAX_DRAG);

    setDragX(clamped);
  };
  // Called when the user releases
  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsAnimating(true); // animate the card going back to center
    //if user swiped far enough trigger the appropriate function
    if (dragX >= SWIPE_THRESHOLD && !completed) {
      onSwipeRight();
    } else if (dragX <= -SWIPE_THRESHOLD && completed) {
      onSwipeLeft();
    }
    // snap the card back to its original position
    setDragX(0);
  };

  // How visible the reveal layer is
  const revealProgress = dragX > 0 ? Math.min(dragX / SWIPE_THRESHOLD, 1) : Math.min(-dragX / SWIPE_THRESHOLD, 1);

  const isSwiping = dragX !== 0;
  const revealColor = completedAtSwipeStart.current ? "#ED2938" : "#ADEA9E"; // red or green

  return (
    <Box position="relative" w="full" mb={4} overflow="hidden" borderRadius="8px">
      {/* Layer that sits behind the card */}
      <Box
        position="absolute"
        inset={0}
        bg={revealColor}
        borderRadius="8px"
        display="flex"
        alignItems="center"
        justifyContent={completedAtSwipeStart.current ? "flex-end" : "flex-start"}
        px="35px"
        opacity={isSwiping ? revealProgress : 0}
        transition={isSwiping ? "none" : "opacity 0.3s ease"}
      >
        {completedAtSwipeStart.current ? <LuX size={35} color="#3B3B3B" /> : <LuCheck size={35} color="#3B3B3B" />}
      </Box>

      {/* Draggable task card */}
      <Box
        transform={`translateX(${dragX}px)`}
        transition={isAnimating ? "transform 0.3s ease" : "none"}
        cursor={isDraggingRef.current ? "grabbing" : "grab"}
        userSelect="none"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <TaskCard date={date} title={title} description={description} minEstimate={minEstimate} completed={completed} />
      </Box>
    </Box>
  );
}
