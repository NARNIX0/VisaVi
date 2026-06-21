"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 90;
const EXIT_MS = 280;

interface SwipeableJobCardProps {
  /** Reset swipe state when the job changes. */
  cardKey: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  /** Called as the user drags — used for page-wide colour feedback. */
  onDragChange?: (dragX: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function SwipeableJobCard({
  cardKey,
  onSwipeLeft,
  onSwipeRight,
  onDragChange,
  children,
  className,
}: SwipeableJobCardProps) {
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);
  const startX = useRef(0);
  const dragging = useRef(false);
  const pointerId = useRef<number | null>(null);

  useEffect(() => {
    setDragX(0);
    setAnimating(false);
    onDragChange?.(0);
  }, [cardKey, onDragChange]);

  useEffect(() => {
    onDragChange?.(dragX);
  }, [dragX, onDragChange]);

  const finishSwipe = useCallback(
    (direction: "left" | "right") => {
      setAnimating(true);
      setDragX(direction === "left" ? -520 : 520);
      window.setTimeout(() => {
        if (direction === "left") onSwipeLeft();
        else onSwipeRight();
        setDragX(0);
        setAnimating(false);
        onDragChange?.(0);
      }, EXIT_MS);
    },
    [onSwipeLeft, onSwipeRight, onDragChange]
  );

  function onPointerDown(e: React.PointerEvent) {
    if (animating) return;
    if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
    dragging.current = true;
    pointerId.current = e.pointerId;
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || pointerId.current !== e.pointerId) return;
    setDragX(e.clientX - startX.current);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging.current || pointerId.current !== e.pointerId) return;
    dragging.current = false;
    pointerId.current = null;

    const x = e.clientX - startX.current;
    if (x > SWIPE_THRESHOLD) finishSwipe("right");
    else if (x < -SWIPE_THRESHOLD) finishSwipe("left");
    else {
      setAnimating(true);
      setDragX(0);
      window.setTimeout(() => setAnimating(false), 200);
    }
  }

  const rotation = dragX * 0.04;
  const saveOpacity = Math.min(1, Math.max(0, dragX / SWIPE_THRESHOLD));
  const passOpacity = Math.min(1, Math.max(0, -dragX / SWIPE_THRESHOLD));

  return (
    <div className={cn("relative z-10 w-full touch-none select-none", className)}>
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-4"
        aria-hidden
      >
        <span
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-lg"
          style={{ opacity: passOpacity, transform: `scale(${0.9 + passOpacity * 0.1})` }}
        >
          PASS
        </span>
        <span
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-lg"
          style={{ opacity: saveOpacity, transform: `scale(${0.9 + saveOpacity * 0.1})` }}
        >
          SAVE
        </span>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
          transition:
            animating && Math.abs(dragX) < 10
              ? "transform 0.2s ease-out"
              : animating
                ? `transform ${EXIT_MS}ms ease-in`
                : dragging.current
                  ? "none"
                  : "transform 0.2s ease-out",
          cursor: dragging.current ? "grabbing" : "grab",
        }}
        className="relative will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
