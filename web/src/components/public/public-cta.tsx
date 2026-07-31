import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A090C] motion-reduce:transition-none";

export function PublicPrimaryLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        base,
        "bg-gradient-to-b from-[#E0C97A] to-[#C9A962] text-[#0A090C]",
        "shadow-[0_8px_28px_rgba(201,169,98,0.28)]",
        "border border-[#F0E0A8]/35",
        "hover:-translate-y-0.5 hover:from-[#E8D48A] hover:to-[#D4AF37] hover:shadow-[0_12px_32px_rgba(201,169,98,0.38)]",
        "active:translate-y-0",
        "motion-reduce:hover:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

export function PublicSecondaryLink({
  className,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        base,
        "border border-white/30 bg-white/[0.06] text-white backdrop-blur-sm",
        "hover:border-[#C9A962]/55 hover:bg-white/[0.1] hover:text-[#F5F0E8]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
