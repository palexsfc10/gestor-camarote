"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  conceptExperiences,
  conceptFeatured,
  conceptVenue,
} from "@/lib/concepts/public-data";
import {
  ConceptMetaPanel,
  ConceptSwitcher,
  StickyReserveBar,
} from "@/components/concepts/concept-chrome";
import { UpcomingEventsCarousel } from "@/components/concepts/upcoming-carousel";
import { CombosCarousel } from "@/components/concepts/combos-carousel";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";

export function ConceptCPage() {
  const reduced = usePrefersReducedMotion();
  const ticker = `${conceptFeatured.dateLabel}  ·  ${conceptFeatured.attraction}  ·  ${conceptFeatured.availabilityLabel}  ·  ${conceptVenue.name}  ·  `;

  return (
    <div className="bg-[#0A0A0B] text-white pb-28 md:pb-12 font-[family-name:var(--font-body)]">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <ConceptSwitcher active="c" />
      </div>

      <div
        className="mt-4 overflow-hidden border-y border-[#D4AF37]/40 bg-[#121014] py-2"
        aria-label="Informações do evento"
      >
        <motion.p
          className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-[#E8D48A]"
          animate={
            reduced
              ? undefined
              : { x: ["0%", "-50%"] }
          }
          transition={
            reduced
              ? undefined
              : { duration: 28, repeat: Infinity, ease: "linear" }
          }
        >
          {ticker}
          {ticker}
        </motion.p>
      </div>

      <section className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 md:grid-cols-12 md:items-stretch">
        <motion.div
          className="relative md:col-span-6 min-h-[70vh] overflow-hidden border-2 border-[#D4AF37]"
          initial={reduced ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduced ? 0 : 0.45 }}
        >
          <Image
            src={conceptFeatured.heroImage}
            alt="Pôster Pagode do Piska"
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37]">
              Live poster
            </p>
            <p className="mt-1 text-sm uppercase tracking-widest">
              {conceptFeatured.shortDate} · {conceptFeatured.timeLabel}
            </p>
          </div>
        </motion.div>

        <div className="md:col-span-6 flex flex-col justify-center py-2 md:py-8">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#D4AF37]">
            {conceptVenue.name}
          </p>
          <h1 className="mt-3 text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl md:text-7xl">
            {conceptFeatured.title}
          </h1>
          <p className="mt-4 text-lg font-semibold uppercase tracking-wide text-white/85">
            {conceptFeatured.attraction}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-white/55">
            {conceptFeatured.genre}
          </p>
          <p className="mt-4 text-sm text-white/60">{conceptFeatured.dateLabel}</p>
          <p
            className="mt-5 inline-flex w-fit items-center gap-2 border border-emerald-400/50 bg-emerald-500/10 px-3 py-2 text-sm font-bold uppercase tracking-wide text-emerald-300"
            role="status"
          >
            <span
              className={`inline-block h-2 w-2 rounded-full bg-emerald-400 ${
                reduced ? "" : "animate-pulse"
              }`}
              aria-hidden
            />
            Ao vivo · {conceptFeatured.availabilityLabel}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={conceptFeatured.reserveHref}
              className="inline-flex min-h-12 items-center bg-[#D4AF37] px-6 text-sm font-black uppercase tracking-wide text-black"
            >
              Reservar agora
            </Link>
            <Link
              href="#experiencias"
              className="inline-flex min-h-12 items-center border-2 border-white px-6 text-sm font-bold uppercase tracking-wide"
            >
              Ver experiência
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        <ConceptMetaPanel id="c" />

        <UpcomingEventsCarousel variant="poster" />

        <section id="experiencias">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Escolha sua noite
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {conceptExperiences.map((exp) => (
              <motion.li
                key={exp.id}
                whileHover={reduced ? undefined : { y: -4 }}
                className={`overflow-hidden border border-white/20 bg-[#121014] ${
                  exp.id === "camarote" ? "sm:col-span-1 ring-2 ring-[#D4AF37]" : ""
                }`}
              >
                <div className="relative aspect-[5/4]">
                  <Image
                    src={exp.image}
                    alt=""
                    fill
                    sizes="(max-width:640px) 100vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  {exp.id === "camarote" ? (
                    <span className="absolute left-2 top-2 bg-[#D4AF37] px-2 py-1 text-[10px] font-black uppercase text-black">
                      Destaque
                    </span>
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-black uppercase">{exp.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{exp.benefit}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-white/50">
                    {exp.capacity}
                  </p>
                  <p className="text-xs font-bold uppercase text-[#E8D48A]">
                    {exp.availability}
                  </p>
                  <Link
                    href={exp.href}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center bg-white text-xs font-black uppercase tracking-wide text-black"
                  >
                    Ir · {exp.title}
                  </Link>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Combos
          </h2>
          <div className="mt-6">
            <CombosCarousel asCarousel />
          </div>
        </section>

        <section className="border border-dashed border-white/25 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            Spot
          </p>
          <p className="mt-2 font-semibold">{conceptVenue.address}</p>
          <p className="text-sm text-white/60">{conceptVenue.hours}</p>
        </section>
      </div>

      <StickyReserveBar
        href={conceptFeatured.reserveHref}
        label="Reservar"
        note={conceptFeatured.availabilityLabel}
      />
    </div>
  );
}
