"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  conceptExperiences,
  conceptFeatured,
  conceptUpcoming,
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

export function ConceptAPage() {
  const reduced = usePrefersReducedMotion();
  const fade = reduced
    ? { initial: false, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#07060A] text-white pb-28 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <ConceptSwitcher active="a" />
      </div>

      <section className="relative mt-4 min-h-[78vh] md:min-h-[85vh] overflow-hidden">
        <Image
          src={conceptFeatured.heroImage}
          alt="Atmosfera do Pagode do Piska na Pérola Gastrobar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center max-md:hidden"
        />
        <Image
          src={conceptFeatured.heroImageMobile}
          alt="Atmosfera do Pagode do Piska na Pérola Gastrobar"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] md:hidden"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#07060A] via-[#07060A]/55 to-black/30"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.55)_100%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[78vh] md:min-h-[85vh] max-w-6xl flex-col justify-end px-4 pb-10 pt-24">
          <motion.div {...fade} transition={{ duration: reduced ? 0 : 0.6 }}>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
              {conceptFeatured.weekday} · {conceptFeatured.shortDate} ·{" "}
              {conceptFeatured.timeLabel}
            </p>
            <h1 className="font-display mt-3 max-w-3xl text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
              {conceptFeatured.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              {conceptFeatured.attraction} — {conceptFeatured.genre}
            </p>
            <p className="mt-2 text-sm text-white/65">{conceptVenue.name}</p>
            <p
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-black/40 px-3 py-1.5 text-sm text-[#E8D48A]"
              role="status"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
              {conceptFeatured.availabilityLabel}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={conceptFeatured.reserveHref}
                className="inline-flex min-h-12 items-center rounded-xl bg-[#D4AF37] px-6 text-sm font-bold text-[#1B1724]"
              >
                Reservar agora
              </Link>
              <Link
                href="#experiencias"
                className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-6 text-sm font-semibold text-white"
              >
                Ver experiência
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
        <ConceptMetaPanel id="a" />

        <UpcomingEventsCarousel />

        <section id="experiencias">
          <h2 className="font-display text-3xl sm:text-4xl">
            Escolha sua noite
          </h2>
          <p className="mt-2 text-white/65 max-w-xl">
            Três caminhos. Uma casa. A noite começa quando você escolhe como
            viver.
          </p>
          <ul className="mt-8 space-y-6">
            {conceptExperiences.map((exp, i) => (
              <motion.li
                key={exp.id}
                initial={reduced ? false : { opacity: 0, x: i % 2 ? 24 : -24 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className={`grid gap-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2 ${
                  i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative min-h-56 md:min-h-72">
                  <Image
                    src={exp.image}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <h3 className="text-2xl font-semibold">{exp.title}</h3>
                  <p className="mt-2 text-white/75">{exp.benefit}</p>
                  <p className="mt-4 text-sm text-white/55">{exp.capacity}</p>
                  <p className="text-sm text-[#E8D48A]">{exp.availability}</p>
                  <Link
                    href={exp.href}
                    className="mt-5 inline-flex min-h-11 w-fit items-center rounded-xl bg-white px-4 text-sm font-bold text-black"
                  >
                    Solicitar {exp.title.toLowerCase()}
                  </Link>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10">
          <div className="grid gap-0 sm:grid-cols-3">
            {[
              conceptExperiences[0].image,
              conceptUpcoming[1].image,
              conceptUpcoming[2].image,
            ].map((src, i) => (
              <div key={src} className="relative aspect-[4/3] sm:aspect-[3/4]">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
                {i === 0 ? (
                  <p className="absolute bottom-3 left-3 text-sm font-semibold drop-shadow">
                    Prévia dos camarotes
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl">Combos da noite</h2>
          <p className="mt-2 text-white/65">
            Prepare a mesa do camarote antes de chegar.
          </p>
          <div className="mt-6 md:hidden">
            <CombosCarousel asCarousel />
          </div>
          <div className="mt-6 hidden md:block">
            <CombosCarousel asCarousel={false} />
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 p-6">
          <h2 className="text-xl font-semibold">Onde estamos</h2>
          <p className="mt-2 text-white/70">{conceptVenue.address}</p>
          <p className="text-white/55">{conceptVenue.hours}</p>
        </section>
      </div>

      <StickyReserveBar
        href={conceptFeatured.reserveHref}
        note={conceptFeatured.availabilityLabel}
      />
    </div>
  );
}
