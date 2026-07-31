"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo } from "@/lib/store/demo-store";
import { EVENT_SLUG } from "@/lib/mock/seed";
import {
  getPublicEventBySlug,
  perolaVenue,
} from "@/lib/perola/public-content";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter, StickyPublicReserve } from "@/components/public/public-footer";
import { FlyerFrame } from "@/components/public/flyer-frame";
import { formatBRL } from "@/lib/utils";

export default function EventDetailPage() {
  const params = usePathnameSlug();
  const { events, spaces, catalog } = useDemo();
  const publicEvent = getPublicEventBySlug(params);
  const storeEvent = events.find(
    (e) => e.slug === params && e.status === "publicado",
  );

  if (!publicEvent && !storeEvent) {
    return (
      <div className="min-h-screen bg-[#0A090C] text-white">
        <PublicHeader />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
          <h1 className="font-display text-2xl sm:text-3xl">
            Evento não encontrado
          </h1>
          <p className="mt-2 text-white/60">
            Eventos em rascunho não aparecem na área pública.
          </p>
          <Link
            href="/demo/eventos"
            className="mt-6 inline-flex min-h-11 text-[#C9A962] underline"
          >
            Voltar aos eventos
          </Link>
        </div>
      </div>
    );
  }

  const title = publicEvent?.title ?? storeEvent!.title;
  const dateLabel = publicEvent?.dateLabel ?? storeEvent!.dateLabel;
  const timeLabel = publicEvent?.timeLabel ?? storeEvent!.timeLabel;
  const attraction = publicEvent?.attractions ?? storeEvent!.attraction;
  const poster =
    publicEvent?.posterImage ??
    storeEvent?.posterImage ??
    "/perola/venue/perola-venue-sign.jpeg";
  const category = publicEvent?.category ?? storeEvent?.category ?? "Evento";
  const reserveSlug = publicEvent?.reserveSlug ?? storeEvent?.slug ?? EVENT_SLUG;
  const free = spaces.filter(
    (s) => s.kind === "camarote" && s.status === "disponivel",
  ).length;
  const freeTables = "Mesas sob consulta na casa";
  const items = catalog.filter(
    (c) =>
      c.active &&
      !c.soldOut &&
      (storeEvent ? c.eventIds.includes(storeEvent.id) : true),
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A090C] pb-24 text-white md:pb-0">
      <PublicHeader />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:gap-8 sm:py-8 md:grid-cols-12 md:items-start">
        {/* Mobile: texto primeiro · Desktop: flyer à esquerda */}
        <div className="order-2 md:order-1 md:col-span-6">
          <FlyerFrame
            src={poster}
            alt={`Arte completa: ${title}`}
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            frameClassName="h-[min(48vh,22rem)] w-full md:h-[min(72vh,40rem)]"
          />
        </div>

        <div className="order-1 md:order-2 md:sticky md:top-24 md:col-span-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
            {category}
          </p>
          <h1 className="font-display mt-2 text-[1.85rem] leading-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {publicEvent?.subtitle ? (
            <p className="mt-2 text-base text-white/70 sm:text-lg">
              {publicEvent.subtitle}
            </p>
          ) : null}
          <p className="mt-3 text-sm uppercase tracking-[0.12em] text-white/55 sm:mt-4">
            {dateLabel} · {timeLabel}
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80 sm:mt-4 sm:text-base">
            {attraction}
          </p>

          {publicEvent?.entryNote ? (
            <p className="mt-3 text-sm text-[#E8D48A] sm:mt-4">
              {publicEvent.entryNote}
            </p>
          ) : null}
          {publicEvent?.promoNote ? (
            <p className="mt-2 text-sm text-white/60">{publicEvent.promoNote}</p>
          ) : null}

          <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:mt-6">
            <p className="text-sm" role="status">
              <span className="font-semibold text-[#E8D48A]">
                {free} camarotes disponíveis
              </span>{" "}
              nesta demo
            </p>
            <p className="text-sm text-white/60">{freeTables}</p>
            <p className="text-sm text-white/55">{perolaVenue.address}</p>
          </div>

          {storeEvent?.rules ? (
            <div className="mt-5 sm:mt-6">
              <h2 className="font-semibold">Regras</h2>
              <p className="mt-1 text-sm text-white/65">{storeEvent.rules}</p>
            </div>
          ) : null}

          {publicEvent?.pendingConfirmation?.length ? (
            <p className="mt-4 text-xs text-white/40">
              Conteúdo pendente de confirmação com a casa:{" "}
              {publicEvent.pendingConfirmation.join(" · ")}
            </p>
          ) : null}

          {items.length > 0 && storeEvent ? (
            <div className="mt-5 sm:mt-6">
              <h2 className="font-semibold">Combos na reserva</h2>
              <ul className="mt-2 space-y-2">
                {items.slice(0, 4).map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between gap-3 border-b border-white/5 py-2 text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="text-[#C9A962]">{formatBRL(item.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 hidden gap-3 md:flex">
            <Link
              href={`/demo/reservar/${reserveSlug}`}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#C9A962] px-6 text-sm font-bold text-[#0A090C]"
            >
              Reservar agora
            </Link>
            <Link
              href="/demo/eventos"
              className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-5 text-sm font-semibold"
            >
              Ver agenda
            </Link>
          </div>
        </div>
      </div>
      <PublicFooter />
      <StickyPublicReserve
        href={`/demo/reservar/${reserveSlug}`}
        note={`${free} camarotes disponíveis`}
        label="Reservar agora"
      />
    </div>
  );
}

function usePathnameSlug() {
  const params = useParams<{ slug: string }>();
  return params.slug;
}
