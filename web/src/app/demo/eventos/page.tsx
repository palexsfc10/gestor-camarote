"use client";

import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter, StickyPublicReserve } from "@/components/public/public-footer";
import { WeekEventsCarousel } from "@/components/public/week-carousel";
import { perolaWeekEvents } from "@/lib/perola/public-content";
import { EVENT_SLUG } from "@/lib/mock/seed";

export default function PublicEventsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A090C] pb-24 text-white md:pb-0">
      <PublicHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
          Agenda
        </p>
        <h1 className="font-display mt-2 text-[1.85rem] leading-tight sm:text-4xl md:text-5xl">
          Eventos e programação
        </h1>
        <p className="mt-3 max-w-xl text-[15px] text-white/65 sm:text-base">
          Cada noite com sua arte. Título, data e reserva fora do flyer — para
          ler no celular sem depender só da imagem.
        </p>

        <div className="mt-8 sm:mt-10">
          <WeekEventsCarousel events={perolaWeekEvents} />
        </div>

        <h2 className="font-display mt-12 text-xl sm:mt-14 sm:text-2xl">
          Lista completa
        </h2>
        <ul className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
          {perolaWeekEvents.map((event) => (
            <li key={event.id}>
              <Link
                href={`/demo/eventos/${event.slug}`}
                className="flex min-h-[5.5rem] gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#121014] p-3 transition-colors active:bg-[#1a171c] hover:border-[#C9A962]/40"
              >
                <div className="relative h-[4.75rem] w-14 shrink-0 overflow-hidden rounded-lg bg-black sm:h-28 sm:w-20">
                  <Image
                    src={event.posterImage}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="text-[10px] uppercase tracking-wider text-[#C9A962] sm:text-[11px]">
                    {event.weekday} · {event.dateLabel} · {event.timeLabel}
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-tight sm:text-lg">
                    {event.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/55">
                    {event.attractions}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <PublicFooter />
      <StickyPublicReserve href={`/demo/reservar/${EVENT_SLUG}`} />
    </div>
  );
}
