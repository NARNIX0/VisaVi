"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface MatchScoreProps {
  /** 0–100 */
  value: number;
  /** Diameter in px. */
  size?: number;
  strokeWidth?: number;
  /** Caption, e.g. "MATCH SCORE" (Artboard 2) or "Overall Match" (Artboard 3). */
  label?: string;
  /** Where the caption sits relative to the ring. */
  labelPlacement?: "inside" | "below";
  /** Append a "%" to the number (Artboard 3 shows "92%"). */
  showPercent?: boolean;
  className?: string;
}

export function MatchScore({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  labelPlacement = "inside",
  showPercent = false,
  className,
}: MatchScoreProps) {
  const gradientId = useId();
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        {/* Centered number (+ inside label) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-bold leading-none text-zinc-900"
            style={{ fontSize: size * 0.26 }}
          >
            {clamped}
            {showPercent && "%"}
          </span>
          {label && labelPlacement === "inside" && (
            <span
              className="mt-1 font-semibold uppercase tracking-wide text-zinc-500"
              style={{ fontSize: size * 0.085 }}
            >
              {label}
            </span>
          )}
        </div>
      </div>

      {label && labelPlacement === "below" && (
        <span className="mt-2 text-sm font-medium text-zinc-600">{label}</span>
      )}
    </div>
  );
}
