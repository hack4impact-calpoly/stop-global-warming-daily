"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { Box, HStack, Tag, Text, VStack } from "@chakra-ui/react";
import { LuCheck, LuChevronRight, LuX } from "react-icons/lu";

type ResourceCardVariant = "discover" | "saved";

interface ResourceListCardProps {
  title: string;
  description: string;
  interestTags: string[];
  variant: ResourceCardVariant;
  onSave?: () => void;
  onDelete?: () => void;
}

const SWIPE_THRESHOLD = 80;
const MAX_DRAG = 120;

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  "Energy Saving": { bg: "#64C9C2", color: "#273D3C" },
  Shopping: { bg: "#4A86E8", color: "#1F2E47" },
  "Waste Reduction": { bg: "#F5662E", color: "#3B2B25" },
  "Nature Preservation & Restoration": { bg: "#51B94F", color: "#1F3B1F" },
  Transportation: { bg: "#BE63EE", color: "#2F1D3B" },
};

const DEFAULT_TAG_STYLE = { bg: "#DDE5EC", color: "#2D3748" };

export default function ResourceListCard({
  title,
  description,
  interestTags,
  variant,
  onSave,
  onDelete,
}: ResourceListCardProps) {
  const [dragX, setDragX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const dragXRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  const getClientX = (e: ReactTouchEvent | ReactMouseEvent | MouseEvent) => {
    if ("touches" in e) return e.touches[0].clientX;
    return e.clientX;
  };

  const getClientY = (e: ReactTouchEvent | ReactMouseEvent | MouseEvent) => {
    if ("touches" in e) return e.touches[0].clientY;
    return e.clientY;
  };

  const handleStart = (e: ReactTouchEvent | ReactMouseEvent) => {
    startXRef.current = getClientX(e);
    startYRef.current = getClientY(e);
    dragXRef.current = 0;
    isDraggingRef.current = true;
    isHorizontalSwipeRef.current = null;
    setIsAnimating(false);
  };

  const handleMove = useCallback(
    (e: ReactTouchEvent | ReactMouseEvent | MouseEvent) => {
      if (!isDraggingRef.current || startXRef.current === null || startYRef.current === null) return;

      const distX = getClientX(e) - startXRef.current;
      const distY = getClientY(e) - startYRef.current;

      if (isHorizontalSwipeRef.current === null && (Math.abs(distX) > 5 || Math.abs(distY) > 5)) {
        isHorizontalSwipeRef.current = Math.abs(distX) > Math.abs(distY);
      }

      if (isHorizontalSwipeRef.current === false) return;

      if (distX < 0) {
        dragXRef.current = 0;
        setDragX(0);
        return;
      }

      const clamped = Math.max(Math.min(distX, MAX_DRAG), -MAX_DRAG);

      dragXRef.current = clamped;
      setDragX(clamped);
    },
    [variant],
  );

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsAnimating(true);

    if (variant === "discover" && dragXRef.current >= SWIPE_THRESHOLD) {
      onSave?.();
    }

    if (variant === "saved" && dragXRef.current >= SWIPE_THRESHOLD) {
      onDelete?.();
    }

    dragXRef.current = 0;
    setDragX(0);
  }, [onDelete, onSave, variant]);

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

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      if (isHorizontalSwipeRef.current === true) e.preventDefault();
    };

    el.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  const isDeleteAction = variant === "saved";
  const actionLabel = isDeleteAction ? "Delete" : "Save";
  const revealColor = isDeleteAction ? "#B8BDC1" : "#ADEA9E";
  const revealProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);
  const isSwiping = dragX !== 0;
  const revealSide = dragX < 0 ? "flex-end" : "flex-start";

  return (
    <Box position="relative" w="100%" overflowX="hidden" overflowY="visible" borderRadius="20px">
      <Box
        position="absolute"
        inset={0}
        bg={revealColor}
        borderRadius="20px"
        display="flex"
        alignItems="center"
        justifyContent={revealSide}
        px="34px"
        opacity={isSwiping ? revealProgress : 0}
        transition={isSwiping ? "none" : "opacity 0.25s ease"}
      >
        <VStack gap={1}>
          {isDeleteAction ? <LuX size={32} color="#3B3B3B" /> : <LuCheck size={34} color="#3B3B3B" />}

          <Text fontSize="sm" fontWeight="semibold" color="#3B3B3B">
            {actionLabel}
          </Text>
        </VStack>
      </Box>

      <Box
        ref={cardRef}
        bg="white"
        borderRadius="20px"
        px={4}
        py={3}
        minH="112px"
        boxShadow="0px 4px 18px rgba(89, 91, 98, 0.10)"
        transform={`translateX(${dragX}px)`}
        transition={isAnimating ? "transform 0.25s ease" : "none"}
        cursor={isDraggingRef.current ? "grabbing" : "grab"}
        userSelect="none"
        touchAction="pan-y"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <HStack align="flex-start" justify="space-between" gap={3}>
          <VStack align="flex-start" gap={1} flex={1}>
            <Text fontSize="xl" fontWeight="bold" lineHeight="1.1" color="black">
              {title}
            </Text>

            <HStack gap={2} flexWrap="wrap">
              {interestTags.map((tag) => {
                const tagStyle = TAG_STYLES[tag] ?? DEFAULT_TAG_STYLE;

                return (
                  <Tag.Root key={tag} size="lg" bg={tagStyle.bg} borderRadius="full" px={4} py={1}>
                    <Tag.Label color={tagStyle.color} fontWeight="semibold">
                      {tag}
                    </Tag.Label>
                  </Tag.Root>
                );
              })}
            </HStack>

            <Text
              fontSize="md"
              color="black"
              lineHeight="1.35"
              css={
                isExpanded
                  ? undefined
                  : {
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }
              }
            >
              {description}
            </Text>
          </VStack>

          <Box
            as="button"
            aria-label={isExpanded ? "Collapse resource description" : "Expand resource description"}
            aria-expanded={isExpanded}
            color="black"
            mt={1}
            onClick={(event) => {
              event.stopPropagation();
              setIsExpanded((expanded) => !expanded);
            }}
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
          >
            <Box transform={isExpanded ? "rotate(90deg)" : "rotate(0deg)"} transition="transform 0.2s ease">
              <LuChevronRight size={24} />
            </Box>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}
