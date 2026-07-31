"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { conceptCombos, conceptFeatured } from "@/lib/concepts/public-data";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";

export function CombosCarousel({
  className = "",
  asCarousel = true,
}: {
  className?: string;
  asCarousel?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    active: asCarousel,
    duration: reduced ? 0 : 25,
  });

  const items = conceptCombos.map((combo) => (
    <article
      key={combo.id}
      className={
        asCarousel
          ? "min-w-0 shrink-0 grow-0 basis-[82%] sm:basis-[45%] lg:basis-[31%]"
          : ""
      }
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        <div className="relative aspect-[5/4]">
          <Image
            src={combo.image}
            alt=""
            fill
            sizes="(max-width:768px) 82vw, 30vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 text-white">
          <h3 className="font-semibold text-lg">{combo.name}</h3>
          <p className="mt-1 text-sm text-white/70">{combo.composition}</p>
          <p className="mt-2 text-[#D4AF37] font-semibold">{combo.price}</p>
          <p className="text-xs text-white/55">{combo.group}</p>
          <Link
            href={conceptFeatured.reserveHref}
            className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold underline underline-offset-4"
          >
            Incluir na reserva
          </Link>
        </div>
      </div>
    </article>
  ));

  if (!asCarousel) {
    return (
      <div className={`grid gap-4 sm:grid-cols-3 ${className}`}>{items}</div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} ref={emblaRef}>
      <div className="flex gap-4">{items}</div>
    </div>
  );
}
