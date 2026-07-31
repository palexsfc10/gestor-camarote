"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageCircle, AtSign } from "lucide-react";
import { perolaAssets, perolaVenue } from "@/lib/perola/public-content";
import { EVENT_SLUG } from "@/lib/mock/seed";
import { PublicPrimaryLink } from "@/components/public/public-cta";

export function PublicFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A962]/50 to-transparent"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-12 md:gap-8 md:py-14">
        <div className="md:col-span-5">
          <div className="relative h-14 w-44">
            <Image
              src={perolaAssets.logo}
              alt="Pérola Gastrobar"
              fill
              sizes="176px"
              className="object-contain object-left"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            Música ao vivo, gastronomia e experiências em Osasco.
          </p>
          <p className="mt-5 flex items-start gap-2 text-sm text-white/45">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A962]/80" />
            {perolaVenue.address}
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9A962]">
            Explore
          </p>
          <ul className="mt-4 space-y-1 text-sm">
            {[
              { href: "/demo/eventos", label: "Eventos" },
              { href: "/demo#experiencias", label: "Experiências" },
              { href: "/demo#aniversarios", label: "Aniversários" },
              { href: "/demo#local", label: "Localização" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-10 items-center text-white/65 transition-colors hover:text-[#E8D48A]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4 md:text-right">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9A962]">
            Contato
          </p>
          <div className="mt-4 flex flex-col gap-1 md:items-end">
            <a
              href={perolaVenue.instagramHref}
              className="inline-flex min-h-10 items-center gap-2 text-sm text-[#E8D48A] transition-opacity hover:opacity-90"
              target="_blank"
              rel="noreferrer"
            >
              <AtSign className="h-4 w-4" />
              {perolaVenue.instagram}
            </a>
            <a
              href={perolaVenue.whatsappHref}
              className="inline-flex min-h-10 items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              {perolaVenue.whatsapp}
            </a>
          </div>
          <PublicPrimaryLink
            href={`/demo/reservar/${EVENT_SLUG}`}
            className="mt-5 md:ml-auto"
          >
            Reservar agora
          </PublicPrimaryLink>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4">
        <p className="mx-auto max-w-6xl text-center text-[11px] text-white/30 md:text-left">
          Pérola Gastrobar · Osasco · KM18
        </p>
      </div>
    </footer>
  );
}

export function StickyPublicReserve({
  href,
  note,
  label = "Reservar",
}: {
  href: string;
  note?: string;
  label?: string;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0A090C]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden"
      data-testid="sticky-public-cta"
    >
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {note ? (
          <p className="min-w-0 flex-1 text-xs leading-snug text-white/65">
            {note}
          </p>
        ) : null}
        <PublicPrimaryLink href={href} className="min-h-12 shrink-0 px-5">
          {label}
        </PublicPrimaryLink>
      </div>
    </div>
  );
}
