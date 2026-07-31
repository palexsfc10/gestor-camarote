"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState, useId, useEffect } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { motion } from "motion/react";
import type { PublicEventCard } from "@/lib/perola/public-content";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Carrossel de programação com scroll-snap nativo (sem Embla).
 * touch-action: manipulation permite rolagem vertical da página sobre os cards
 * e gesto horizontal no overflow-x do container.
 */
export function WeekEventsCarousel({ events }: { events: PublicEventCard[] }) {
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLUListElement>(null);

  const scrollByCard = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-program-card]");
    const delta = (card?.offsetWidth ?? el.clientWidth * 0.78) + 16;
    el.scrollBy({ left: dir * delta, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  // Chrome captura wheel em overflow-x e impede rolagem da página.
  // Gestos predominantemente verticais são repassados ao document.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0, behavior: "auto" });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div data-testid="week-programacao">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
            Programação
          </p>
          <h2 className="font-display mt-1 text-[1.75rem] leading-tight text-white sm:text-3xl md:text-4xl">
            Semana no Pérola
          </h2>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Anterior"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white active:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Próximo"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white active:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        data-testid="week-programacao-scroller"
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 sm:gap-4",
          /* Permite pan vertical (página) + horizontal (carrossel); evita bloqueio do Embla/touch-pan-x */
          "touch-manipulation",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {events.map((event, i) => (
          <li
            key={event.id}
            className="min-w-0 shrink-0 grow-0 basis-[78%] snap-start sm:basis-[46%] lg:basis-[31%]"
          >
            <ProgramEventCard event={event} index={i} reduced={reduced} />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-center text-[11px] text-white/40 sm:hidden">
        Deslize para ver mais eventos da semana
      </p>
    </div>
  );
}

function ProgramEventCard({
  event,
  index,
  reduced,
}: {
  event: PublicEventCard;
  index: number;
  reduced: boolean;
}) {
  const [lightbox, setLightbox] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!lightbox) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const availability = event.reservationsOpen
    ? "Reservas abertas"
    : "Consulte a casa";

  return (
    <>
      <motion.article
        data-program-card
        initial={reduced ? false : { opacity: 0, y: 12 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: reduced ? 0 : index * 0.04, duration: 0.35 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#121014]"
      >
        {/* Área fixa do flyer — aspect-ratio padronizado; contain sem distorcer */}
        <div className="relative shrink-0 bg-black p-2 pb-0">
          <div
            data-testid="program-flyer"
            className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-black"
          >
            <Image
              src={event.posterImage}
              alt={`Arte: ${event.title}`}
              fill
              sizes="(max-width:768px) 78vw, 30vw"
              className="object-contain"
              loading="lazy"
              draggable={false}
            />
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="absolute bottom-2 right-2 z-10 inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-full border border-white/25 bg-black/75 px-3 text-xs font-semibold text-white backdrop-blur-sm active:scale-[0.98]"
              aria-haspopup="dialog"
            >
              <Expand className="h-3.5 w-3.5" aria-hidden />
              Ampliar
            </button>
          </div>
        </div>

        {/* Bloco de info com alturas reservadas + CTA no fim */}
        <div className="flex flex-1 flex-col p-4 text-white">
          <p className="min-h-[1.125rem] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A962] line-clamp-1">
            {event.weekday} · {event.dateLabel} · {event.timeLabel}
          </p>
          <h3 className="mt-1 min-h-[2.75rem] text-base font-semibold leading-tight line-clamp-2 sm:min-h-[3.25rem] sm:text-lg">
            {event.title}
          </h3>
          <p className="mt-1 min-h-[2.5rem] text-sm leading-snug text-white/60 line-clamp-2">
            {event.attractions}
          </p>
          <p
            className="mt-2 min-h-[1rem] text-xs text-[#E8D48A]"
            role="status"
          >
            {availability}
          </p>
          <Link
            href={`/demo/eventos/${event.slug}`}
            className="mt-auto inline-flex min-h-11 touch-manipulation items-center pt-3 text-sm font-bold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A962]"
          >
            Ver evento
          </Link>
        </div>
      </motion.article>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p id={titleId} className="min-w-0 truncate text-sm text-white/80">
              Arte: {event.title}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white"
              aria-label="Fechar ampliação"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Image
              src={event.posterImage}
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
