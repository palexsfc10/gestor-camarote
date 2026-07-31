"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlyerFrame({
  src,
  alt,
  className,
  /** Altura máxima do flyer (mobile-first). Desktop pode omitir limite. */
  frameClassName = "h-[min(48vh,22rem)] w-full md:h-[min(70vh,36rem)]",
  sizes = "(max-width:768px) 100vw, 40vw",
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  frameClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <figure
        className={cn(
          "relative overflow-hidden rounded-2xl border border-[#C9A962]/30 bg-black",
          className,
        )}
      >
        <div className={cn("relative mx-auto", frameClassName)}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-contain"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/75 px-3.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:border-[#C9A962]/50 active:scale-[0.98]"
          aria-haspopup="dialog"
        >
          <Expand className="h-4 w-4" aria-hidden />
          Ampliar
        </button>
      </figure>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p id={titleId} className="min-w-0 truncate text-sm text-white/80">
              {alt}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white"
              aria-label="Fechar ampliação"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-contain p-2"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
