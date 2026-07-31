"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { conceptUpcoming } from "@/lib/concepts/public-data";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";

export function UpcomingEventsCarousel({
  variant = "dark",
}: {
  variant?: "dark" | "light" | "poster";
}) {
  const reduced = usePrefersReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    duration: reduced ? 0 : 25,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const cardClass =
    variant === "light"
      ? "bg-[#F7F3EA] text-[#1B1724] border-[#E5DFD0]"
      : variant === "poster"
        ? "bg-[#12101A] text-white border-[#D4AF37]/40"
        : "bg-white/5 text-white border-white/10";

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2
          className={`font-semibold text-xl sm:text-2xl ${
            variant === "light" ? "text-[#1B1724]" : "text-white"
          }`}
        >
          Próximos eventos
        </h2>
        <div className="hidden sm:flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Evento anterior"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Próximo evento"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <ul className="flex touch-pan-y gap-4">
          {conceptUpcoming.map((event) => (
            <li
              key={event.id}
              className="min-w-0 shrink-0 grow-0 basis-[78%] sm:basis-[42%] lg:basis-[30%]"
            >
              <article
                className={`overflow-hidden rounded-2xl border ${cardClass}`}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={event.image}
                    alt=""
                    fill
                    sizes="(max-width:768px) 78vw, 30vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <p className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {event.genre}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <p className="text-xs opacity-80">{event.dateLabel}</p>
                    <h3 className="font-semibold text-lg leading-tight">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#E8D48A]">
                      {event.availability}
                    </p>
                    <Link
                      href={event.href}
                      className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-white px-3 text-xs font-bold text-black"
                    >
                      Ver noite
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
