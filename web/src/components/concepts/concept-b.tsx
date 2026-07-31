"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  conceptExperiences,
  conceptFeatured,
  conceptVenue,
  conceptCombos,
} from "@/lib/concepts/public-data";
import {
  ConceptMetaPanel,
  ConceptSwitcher,
  StickyReserveBar,
} from "@/components/concepts/concept-chrome";
import { UpcomingEventsCarousel } from "@/components/concepts/upcoming-carousel";
import { CombosCarousel } from "@/components/concepts/combos-carousel";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";

export function ConceptBPage() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="bg-[#F3EEE4] text-[#1A1714] pb-28 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <ConceptSwitcher active="b" tone="light" />
      </div>

      <section className="mx-auto mt-6 grid max-w-6xl gap-0 px-4 md:grid-cols-12 md:min-h-[78vh]">
        <div className="relative md:col-span-7 min-h-[58vh] md:min-h-full overflow-hidden">
          <Image
            src={conceptFeatured.heroImage}
            alt="Arte do Pagode do Piska"
            fill
            priority
            sizes="(max-width:768px) 100vw, 58vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/50 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#F3EEE4]/40"
            aria-hidden
          />
        </div>

        <div className="md:col-span-5 flex flex-col justify-center py-8 md:py-12 md:pl-10">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.5 }}
          >
            <p className="font-display text-6xl leading-none tracking-tight text-[#8B1E2D] sm:text-7xl">
              {conceptFeatured.shortDate}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-[#5C564C]">
              {conceptFeatured.dateLabel} · {conceptFeatured.timeLabel}
            </p>
            <h1 className="font-display mt-6 text-4xl leading-[1.05] sm:text-5xl">
              {conceptFeatured.title}
            </h1>
            <p className="mt-4 text-lg text-[#3D3830]">
              {conceptFeatured.attraction}
              <span className="text-[#8B1E2D]"> · </span>
              {conceptFeatured.genre}
            </p>
            <p className="mt-2 text-sm text-[#5C564C]">{conceptVenue.name}</p>
            <p
              className="mt-5 border-l-2 border-[#8B1E2D] pl-3 text-sm font-medium"
              role="status"
            >
              {conceptFeatured.availabilityLabel}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={conceptFeatured.reserveHref}
                className="inline-flex min-h-12 items-center bg-[#1A1714] px-6 text-sm font-semibold text-[#F3EEE4]"
              >
                Reservar agora
              </Link>
              <Link
                href="#experiencias"
                className="inline-flex min-h-12 items-center border border-[#1A1714]/40 px-6 text-sm font-semibold"
              >
                Ver experiência
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-14">
        <ConceptMetaPanel id="b" tone="light" />

        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-[#8B1E2D]">
            Agenda cultural
          </p>
          <UpcomingEventsCarousel variant="light" />
        </section>

        <section id="experiencias">
          <h2 className="font-display text-3xl sm:text-4xl">Escolha sua noite</h2>
          <p className="mt-2 max-w-lg text-[#5C564C]">
            Experiências distintas — não um catálogo administrativo.
          </p>
          <div className="mt-10 space-y-16">
            {conceptExperiences.map((exp, i) => (
              <motion.article
                key={exp.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45 }}
                className={`grid items-center gap-8 md:grid-cols-12 ${
                  i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div
                  className={`relative aspect-[4/5] overflow-hidden md:col-span-7 ${
                    i === 1 ? "md:col-span-5 md:aspect-[3/4]" : ""
                  }`}
                >
                  <Image
                    src={exp.image}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 55vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div
                  className={`md:col-span-5 ${i === 1 ? "md:col-span-7 md:pl-8" : "md:pl-4"}`}
                >
                  <h3 className="font-display text-3xl">{exp.title}</h3>
                  <p className="mt-3 text-lg text-[#3D3830]">{exp.benefit}</p>
                  <p className="mt-4 text-sm text-[#5C564C]">{exp.capacity}</p>
                  <p className="text-sm font-medium text-[#8B1E2D]">
                    {exp.availability}
                  </p>
                  <Link
                    href={exp.href}
                    className="mt-6 inline-flex min-h-11 items-center border-b-2 border-[#1A1714] pb-1 text-sm font-semibold"
                  >
                    Solicitar {exp.title.toLowerCase()}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl">Experiências à mesa</h2>
          <p className="mt-2 text-[#5C564C]">
            Combos apresentados como composição — não como lista de estoque.
          </p>
          <div className="mt-8 md:hidden">
            <CombosCarousel asCarousel />
          </div>
          <ul className="mt-8 hidden gap-6 md:grid md:grid-cols-12">
            {conceptCombos.map((combo, i) => (
              <li
                key={combo.id}
                className={
                  i === 0
                    ? "md:col-span-5"
                    : i === 1
                      ? "md:col-span-4 md:mt-12"
                      : "md:col-span-3 md:mt-6"
                }
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={combo.image}
                    alt=""
                    fill
                    sizes="30vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-3 font-display text-xl">{combo.name}</h3>
                <p className="text-sm text-[#5C564C]">{combo.composition}</p>
                <p className="mt-1 font-semibold">{combo.price}</p>
                <p className="text-xs text-[#5C564C]">{combo.group}</p>
                <Link
                  href={conceptFeatured.reserveHref}
                  className="mt-2 inline-flex min-h-10 items-center text-sm font-semibold underline underline-offset-4"
                >
                  Incluir na reserva
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-10 border-t border-[#1A1714]/15 pt-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">A casa</h2>
            <p className="mt-3 leading-relaxed text-[#3D3830]">
              {conceptVenue.story}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl">Onde estamos</h2>
            <p className="mt-3 text-[#3D3830]">{conceptVenue.address}</p>
            <p className="text-[#5C564C]">{conceptVenue.hours}</p>
            <p className="mt-2 text-sm">{conceptVenue.instagram}</p>
          </div>
        </section>
      </div>

      <StickyReserveBar
        href={conceptFeatured.reserveHref}
        note={conceptFeatured.availabilityLabel}
      />
    </div>
  );
}
