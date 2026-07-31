"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";
import { cn } from "@/lib/utils";

export type ExperienceCard = {
  title: string;
  benefit: string;
  meta: string;
  href: string;
  image: string;
  cta: string;
  accent?: boolean;
  contain?: boolean;
};

export function ExperienceCards({ items }: { items: ExperienceCard[] }) {
  const reduced = usePrefersReducedMotion();
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    duration: reduced ? 0 : 22,
  });

  return (
    <div>
      {/* Mobile / small tablet: carrossel com peek */}
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <ul className="flex touch-pan-x gap-3">
            {items.map((item) => (
              <li
                key={item.title}
                className="min-w-0 shrink-0 grow-0 basis-[78%] sm:basis-[58%]"
              >
                <ExperienceCompact card={item} />
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-center text-[11px] text-white/40">
          Deslize para ver Camarote, Mesa e Aniversário
        </p>
      </div>

      {/* Tablet+: grade */}
      <div className="mt-0 hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ExperienceCompact key={item.title} card={item} tall />
        ))}
      </div>
    </div>
  );
}

function ExperienceCompact({
  card,
  tall,
}: {
  card: ExperienceCard;
  tall?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-[#121014]",
        card.accent ? "border-[#C9A962]/50" : "border-white/10",
      )}
    >
      <div
        className={cn(
          "relative bg-black",
          tall ? "aspect-[5/4]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(max-width:768px) 78vw, 33vw"
          className={card.contain ? "object-contain" : "object-cover"}
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-semibold sm:text-xl">{card.title}</h3>
        <p className="mt-1.5 text-sm leading-snug text-white/70">{card.benefit}</p>
        <p className="mt-2 text-xs text-[#E8D48A]">{card.meta}</p>
        <Link
          href={card.href}
          className="mt-auto inline-flex min-h-11 items-center pt-3 text-sm font-bold text-white/90 underline underline-offset-4 transition-colors active:text-[#E8D48A] hover:text-[#E8D48A]"
        >
          {card.cta}
        </Link>
      </div>
    </article>
  );
}
