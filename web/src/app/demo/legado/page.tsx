"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDemo } from "@/lib/store/demo-store";
import { EVENT_SLUG } from "@/lib/mock/seed";
import { formatBRL } from "@/lib/utils";
import { AtSign, MapPin, MessageCircle } from "lucide-react";

/** Home pública anterior (template) — preservada para comparação. */
export default function LegadoHomePage() {
  const { site, events, catalog, spaces } = useDemo();
  const featured = events.find((e) => e.slug === EVENT_SLUG)!;
  const free = spaces.filter((s) => s.status === "disponivel").length;
  const highlights = catalog.filter((c) => c.highlight && c.active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10 text-[var(--fg)]">
      <p className="mb-4 text-sm text-[var(--muted)]">
        Versão legada ·{" "}
        <Link href="/demo" className="text-[var(--accent)] underline">
          ver direção Pérola v2
        </Link>
      </p>
      <section
        className={`relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br ${featured.imageGradient} p-6 sm:p-10`}
      >
        <Badge tone="accent">Evento em destaque</Badge>
        <h1 className="font-display mt-4 text-3xl sm:text-5xl max-w-xl">
          {site.name}
        </h1>
        <p className="mt-2 text-[var(--fg-muted)] max-w-lg">{site.tagline}</p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
            {featured.dateLabel} · {featured.timeLabel}
          </p>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            {featured.attraction}
          </p>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            {free} camarotes livres agora
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link href={`/demo/reservar/${EVENT_SLUG}`}>Reservar</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href={`/demo/eventos/${EVENT_SLUG}`}>Ver evento</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Próximos eventos</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {events
            .filter((event) => event.status === "publicado")
            .map((event) => (
              <li key={event.id}>
                <Link
                  href={`/demo/eventos/${event.slug}`}
                  className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 min-h-24"
                >
                  <p className="font-semibold">{event.title}</p>
                  <p className="mt-1 text-sm text-[var(--fg-muted)]">
                    {event.dateLabel} · {event.timeLabel}
                  </p>
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Combos e destaques</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="text-xs text-[var(--muted)]">{item.category}</p>
              <p className="mt-1 font-semibold">{item.name}</p>
              <p className="mt-3 font-display text-lg text-[var(--accent)]">
                {formatBRL(item.price)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div>
          <h2 className="font-display text-xl">Onde estamos</h2>
          <p className="mt-3 flex items-start gap-2 text-sm text-[var(--fg-muted)]">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
            {site.address}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="inline-flex min-h-11 items-center gap-2 text-sm">
            <AtSign className="h-4 w-4" />
            {site.instagram}
          </span>
          <span className="inline-flex min-h-11 items-center gap-2 text-sm">
            <MessageCircle className="h-4 w-4" />
            {site.whatsapp}
          </span>
        </div>
      </section>
    </div>
  );
}
