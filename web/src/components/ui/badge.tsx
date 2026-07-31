import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  tone = "neutral",
}: {
  className?: string;
  children: ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger" | "info" | "accent";
}) {
  const tones = {
    neutral: "bg-[var(--surface-2)] text-[var(--fg-muted)] border-[var(--border)]",
    success: "bg-[#1F3D30] text-[#9EE0BC] border-[#2F6B4F]",
    warn: "bg-[#3D3018] text-[#F0D58A] border-[#8A6A20]",
    danger: "bg-[#3D1F1F] text-[#F0A8A8] border-[#8B3A3A]",
    info: "bg-[#1E2A3D] text-[#A8C4F0] border-[#3A567B]",
    accent: "bg-[#3D3418] text-[#E8D48A] border-[var(--accent)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
