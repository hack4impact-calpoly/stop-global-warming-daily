"use client";
import { useRef, useState, useEffect, useCallback } from "react";
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
  const startYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);
  const completedAtSwipeStart = useRef(completed);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragXRef = useRef(0); // mirrors dragX for use inside event listeners

  // Gets a horizontal position of the pointer when user touches
  const getClientX = (e: React.TouchEvent | React.MouseEvent | MouseEvent): number => {
    if ("touches" in e) return (e as React.TouchEvent).touches[0].clientX;
    return (e as MouseEvent).clientX;
  };

  // Gets a vertical position of the pointer when user touches
  const getClientY = (e: React.TouchEvent | React.MouseEvent | MouseEvent): number => {
    if ("touches" in e) return (e as React.TouchEvent).touches[0].clientY;
    return (e as MouseEvent).clientY;
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    completedAtSwipeStart.current = completed;
    startXRef.current = getClientX(e);
    startYRef.current = getClientY(e);
    isHorizontalSwipeRef.current = null;
    isDraggingRef.current = true;
    setIsAnimating(false);
  };

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent | MouseEvent) => {
      // ignore if we're not in a drag or if the start position was never set
      if (!isDraggingRef.current || startXRef.current === null || startYRef.current === null) return;
      // how far pointer moved where it started
      const distX = getClientX(e) - startXRef.current;
      const distY = getClientY(e) - startYRef.current;

      // On first significant move, lock in the direction
      if (isHorizontalSwipeRef.current === null && (Math.abs(distX) > 5 || Math.abs(distY) > 5)) {
        isHorizontalSwipeRef.current = Math.abs(distX) > Math.abs(distY);
      }

      // If its a vertical swipe, bail out entirely
      if (isHorizontalSwipeRef.current === false) return;

      // only allow swiping in the direction that makes sense
      if (completed && distX > 0) return;
      if (!completed && distX < 0) return;

      // clamp drag distance
      const clamped = distX > 0 ? Math.min(distX, MAX_DRAG) : Math.max(distX, -MAX_DRAG);
      dragXRef.current = clamped;
      setDragX(clamped);
    },
    [completed],
  );

  // Called when the user releases
  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsAnimating(true); // animate the card going back to center
    //if user swiped far enough trigger the appropriate function
    if (dragXRef.current >= SWIPE_THRESHOLD && !completed) {
      onSwipeRight();
    } else if (dragXRef.current <= -SWIPE_THRESHOLD && completed) {
      onSwipeLeft();
    }
    // snap the card back to its original position
    dragXRef.current = 0;
    setDragX(0);
  }, [completed, onSwipeRight, onSwipeLeft]);

  // Mouse events so dragging outside the card still works
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onMouseUp = () => handleEnd();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleMove, handleEnd]);

  // Non passive touch listener that blocks scroll when swiping horizontally
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onTouchMove = (e: TouchEvent) => {
      if (isHorizontalSwipeRef.current === true || e.cancelable) e.preventDefault();
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  // How visible the reveal layer is
  const revealProgress = dragX > 0 ? Math.min(dragX / SWIPE_THRESHOLD, 1) : Math.min(-dragX / SWIPE_THRESHOLD, 1);

  const isSwiping = dragX !== 0;
  const revealColor = completedAtSwipeStart.current ? "#ED2938" : "#ADEA9E"; // red or green

  return (
    <Box position="relative" w="full" mb={4} overflowX="hidden" overflowY="visible" borderRadius="8px">
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
        ref={cardRef}
        transform={`translateX(${dragX}px)`}
        transition={isAnimating ? "transform 0.3s ease" : "none"}
        cursor={isDraggingRef.current ? "grabbing" : "grab"}
        userSelect="none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <TaskCard date={date} title={title} description={description} minEstimate={minEstimate} completed={completed} />
      </Box>
    </Box>
  );
}
