"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "motion/react";
import { MapPin, MessageCircle, AtSign, ArrowUpRight } from "lucide-react";
import { useDemo } from "@/lib/store/demo-store";
import { EVENT_SLUG } from "@/lib/mock/seed";
import {
  gastronomyHighlights,
  perolaAssets,
  perolaVenue,
  perolaWeekEvents,
} from "@/lib/perola/public-content";
import { PublicHeader } from "@/components/public/public-header";
import { PublicMarquee } from "@/components/public/public-marquee";
import {
  PublicFooter,
  StickyPublicReserve,
} from "@/components/public/public-footer";
import {
  PublicPrimaryLink,
  PublicSecondaryLink,
} from "@/components/public/public-cta";
import { WeekEventsCarousel } from "@/components/public/week-carousel";
import { BirthdaySection } from "@/components/public/birthday-section";
import { ExperienceCards } from "@/components/public/experience-cards";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";

export function PerolaPublicHome() {
  const { spaces } = useDemo();
  const free = spaces.filter(
    (s) => s.kind === "camarote" && s.status === "disponivel",
  ).length;
  const featured =
    perolaWeekEvents.find((e) => e.featured) ?? perolaWeekEvents[0];
  const reduced = usePrefersReducedMotion();
  const [birthdayInView, setBirthdayInView] = useState(false);
  const onBirthdayInView = useCallback((v: boolean) => setBirthdayInView(v), []);

  const experiences = [
    {
      title: "Camarote",
      benefit: "Vista privilegiada e exclusividade para o grupo",
      meta: `Até 10 pessoas · ${free} disponíveis`,
      href: `/demo/reservar/${EVENT_SLUG}?tipo=camarote`,
      image: perolaAssets.venueSign,
      cta: "Reservar camarote",
      accent: true,
    },
    {
      title: "Mesa",
      benefit: "Gastronomia, conversa e ritmo perto da pista",
      meta: "Até 6 pessoas · vagas nesta noite",
      href: `/demo/reservar/${EVENT_SLUG}?tipo=mesa`,
      image: perolaAssets.gastronomy,
      cta: "Reservar mesa",
    },
    {
      title: "Aniversário",
      benefit: "Pacotes com convidados VIP e celebração na casa",
      meta: "Sob medida · arte oficial abaixo",
      href: "/demo#aniversarios",
      image: perolaAssets.birthday,
      cta: "Ver pacotes",
      contain: true,
    },
  ];

  return (
    <div className="overflow-x-hidden bg-[#0A090C] text-white pb-24 md:pb-0">
      <div className="sticky top-0 z-50">
        <PublicMarquee />
        <PublicHeader transparent />
      </div>

      <section
        className="relative overflow-hidden"
        aria-label="Apresentação Pérola Gastrobar"
      >
        <div className="absolute inset-0 bg-black" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                180deg,
                #000000 0%,
                #000000 18%,
                #0A0B10 32%,
                #10131C 48%,
                #1A1410 68%,
                #2A1C12 82%,
                #0A090C 100%
              )
            `,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 55% at 50% 0%, rgba(0,0,0,0.95) 0%, transparent 55%),
              radial-gradient(ellipse 70% 50% at 20% 55%, rgba(28, 48, 78, 0.22) 0%, transparent 60%),
              radial-gradient(ellipse 80% 55% at 78% 62%, rgba(168, 112, 48, 0.22) 0%, transparent 55%),
              radial-gradient(ellipse 55% 40% at 48% 78%, rgba(201, 169, 98, 0.12) 0%, transparent 60%)
            `,
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.28] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A090C] to-transparent md:h-36"
          aria-hidden
        />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-6 px-4 pb-10 pt-6 sm:gap-8 sm:pb-12 sm:pt-8 md:min-h-[88vh] md:grid-cols-12 md:gap-8 md:pb-16 md:pt-12">
          <motion.div
            className="md:col-span-6 lg:col-span-7"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.55 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#C9A962]">
              Osasco · KM18
            </p>
            <h1 className="font-display mt-3 max-w-xl text-[1.85rem] leading-[1.12] text-[#F5F0E8] sm:mt-4 sm:text-[2.35rem] md:text-[3.4rem] md:leading-[1.05]">
              Música, gastronomia
              <span className="hidden sm:inline"> e experiências</span>
              <span className="sm:hidden">
                <br />e experiências
              </span>
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/72 sm:mt-5 sm:text-base md:text-lg">
              A casa tem programação, atmosfera e reserva — camarotes, mesas e
              celebrações no ritmo do Pérola.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              <PublicPrimaryLink
                href={`/demo/reservar/${EVENT_SLUG}`}
                className="min-h-12 flex-1 px-5 sm:flex-none"
              >
                Reservar agora
              </PublicPrimaryLink>
              <PublicSecondaryLink
                href="/demo/eventos"
                className="min-h-12 flex-1 px-5 sm:flex-none"
              >
                Ver eventos
              </PublicSecondaryLink>
            </div>
          </motion.div>

          <motion.aside
            className="md:col-span-6 lg:col-span-5"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.55,
              delay: reduced ? 0 : 0.12,
            }}
            aria-label="Próximo destaque"
          >
            {/* Mobile: faixa compacta */}
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-black/55 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-md ring-1 ring-[#C9A962]/15 md:hidden">
              <div className="flex gap-3 p-2.5">
                <div className="relative h-[4.75rem] w-[3.5rem] shrink-0 overflow-hidden rounded-lg bg-black">
                  <Image
                    src={featured.posterImage}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A962]">
                    Destaque · {featured.weekday} · {featured.dateLabel}
                  </p>
                  <h2 className="mt-1 truncate font-display text-lg leading-tight">
                    {featured.title}
                  </h2>
                  <p className="mt-1 text-xs text-[#E8D48A]" role="status">
                    {free} camarotes livres
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/demo/reservar/${featured.reserveSlug ?? EVENT_SLUG}`}
                      className="inline-flex min-h-9 items-center text-xs font-bold text-[#E8D48A] underline underline-offset-4"
                    >
                      Reservar
                    </Link>
                    <Link
                      href={`/demo/eventos/${featured.slug}`}
                      className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-white/65"
                    >
                      Ver noite
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop / tablet: card completo */}
            <div className="hidden overflow-hidden rounded-2xl border border-white/15 bg-black/55 p-1 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md ring-1 ring-[#C9A962]/15 md:block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image
                  src={featured.posterImage}
                  alt=""
                  fill
                  sizes="(max-width:768px) 100vw, 40vw"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <p className="absolute left-3 top-3 rounded-full border border-[#C9A962]/40 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8D48A]">
                  Destaque
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#C9A962]">
                  {featured.weekday} · {featured.dateLabel} · {featured.timeLabel}
                </p>
                <h2 className="mt-1.5 font-display text-2xl leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-white/60">
                  {featured.attractions}
                </p>
                <p className="mt-3 text-sm text-[#E8D48A]" role="status">
                  {free} camarotes disponíveis
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <PublicPrimaryLink
                    href={`/demo/reservar/${featured.reserveSlug ?? EVENT_SLUG}`}
                    className="min-h-11 px-5 text-xs"
                  >
                    Reservar
                  </PublicPrimaryLink>
                  <Link
                    href={`/demo/eventos/${featured.slug}`}
                    className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-semibold text-white/70 underline-offset-4 transition-colors hover:text-[#E8D48A] hover:underline"
                  >
                    Ver noite
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:space-y-16 sm:py-12 md:space-y-24 md:py-16">
        <section id="programacao">
          <WeekEventsCarousel events={perolaWeekEvents} />
        </section>

        <section id="experiencias" className="scroll-mt-28">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
            A noite do seu jeito
          </p>
          <h2 className="font-display mt-2 text-[1.75rem] leading-tight sm:text-3xl md:text-4xl">
            Escolha sua experiência
          </h2>
          <div className="mt-6 sm:mt-8">
            <ExperienceCards items={experiences} />
          </div>
        </section>

        <BirthdaySection onInViewChange={onBirthdayInView} />

        <section id="sabores">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
            Casa completa
          </p>
          <h2 className="font-display mt-2 text-[1.75rem] leading-tight sm:text-3xl md:text-4xl">
            Sabores do Pérola
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-white/65 sm:text-base">
            Gastrobar de verdade — petiscos, buffet e promoções da noite,
            associados às reservas.
          </p>
          <ul className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 touch-pan-x sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
            {gastronomyHighlights.map((item) => (
              <li
                key={item.id}
                className="w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-[#121014] sm:w-auto sm:shrink"
              >
                <div className="relative aspect-[4/5] max-h-56 sm:max-h-none">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(max-width:640px) 78vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/65">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-0 overflow-hidden rounded-2xl border border-white/10 sm:rounded-3xl md:grid-cols-2">
          <div className="relative min-h-48 sm:min-h-64 md:min-h-72">
            <Image
              src={perolaAssets.venueSign}
              alt="Ambiente e placa do Pérola"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center p-5 sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl">O ambiente</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70 sm:text-base">
              Luz âmbar, placa dourada, noite urbana. A identidade da casa
              estrutura a experiência — cada arte de evento traz sua própria
              personalidade.
            </p>
          </div>
        </section>

        <section
          id="local"
          className="relative scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-black sm:rounded-[1.75rem]"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.08),transparent_50%)]"
            aria-hidden
          />
          <div className="relative grid gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            <div className="lg:col-span-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
                Contato
              </p>
              <h2 className="font-display mt-2 text-[1.75rem] leading-tight sm:mt-3 sm:text-3xl md:text-4xl">
                Onde estamos
              </h2>
              <p className="mt-3 max-w-sm text-[15px] text-white/65 sm:text-base">
                Endereço, Instagram e WhatsApp para falar com a casa e reservar.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
              {(
                [
                  {
                    href: `https://maps.google.com/?q=${encodeURIComponent(perolaVenue.address)}`,
                    icon: MapPin,
                    label: "Endereço",
                    value: perolaVenue.address,
                    accent: false,
                  },
                  {
                    href: perolaVenue.instagramHref,
                    icon: AtSign,
                    label: "Instagram",
                    value: perolaVenue.instagram,
                    accent: true,
                  },
                  {
                    href: perolaVenue.whatsappHref,
                    icon: MessageCircle,
                    label: "WhatsApp",
                    value: perolaVenue.whatsapp,
                    accent: false,
                  },
                ] as const
              ).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full min-h-[6.5rem] flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 active:bg-white/[0.08] hover:border-[#C9A962]/40 hover:bg-white/[0.06] sm:min-h-[8.5rem]"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#C9A962]/35 bg-[#C9A962]/10 text-[#C9A962]">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/45 sm:mt-4">
                      {item.label}
                    </p>
                    <p
                      className={`mt-1 text-sm leading-snug ${
                        item.accent ? "text-[#E8D48A]" : "text-white/85"
                      }`}
                    >
                      {item.value}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <PublicFooter />
      <StickyPublicReserve
        href={
          birthdayInView
            ? `/demo/reservar/${EVENT_SLUG}?tipo=aniversario`
            : `/demo/reservar/${EVENT_SLUG}`
        }
        note={
          birthdayInView
            ? "Pacotes 10 a 30 convidados"
            : `${free} camarotes disponíveis`
        }
        label={birthdayInView ? "Quero comemorar" : "Reservar"}
      />
    </div>
  );
}
