"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminEventosPage() {
  const { events, updateEvent, addEvent } = useDemo();
  const [view, setView] = useState<"lista" | "calendario">("lista");

  return (
    <div className="px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Eventos</h1>
        <Button asChild>
          <Link href="/demo/admin/eventos/novo">Novo evento</Link>
        </Button>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          variant={view === "lista" ? "default" : "secondary"}
          onClick={() => setView("lista")}
        >
          Lista
        </Button>
        <Button
          size="sm"
          variant={view === "calendario" ? "default" : "secondary"}
          onClick={() => setView("calendario")}
        >
          Calendário
        </Button>
      </div>

      {view === "calendario" ? (
        <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="font-semibold">Agosto 2026</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-sm">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                className={`min-h-11 sm:min-h-12 rounded-lg flex items-center justify-center text-xs sm:text-sm ${
                  d === 15 || d === 21
                    ? "bg-[var(--surface-2)] text-[var(--accent)] font-semibold border border-[var(--accent)]"
                    : "text-[var(--fg-muted)]"
                }`}
              >
                {d}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Calendário é visão dentro de Eventos (não item de menu separado).
          </p>
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold text-lg">{event.title}</h2>
                <p className="text-sm text-[var(--fg-muted)]">
                  {event.dateLabel} · {event.timeLabel}
                </p>
              </div>
              <Badge
                tone={
                  event.status === "publicado"
                    ? "success"
                    : event.status === "rascunho"
                      ? "neutral"
                      : "warn"
                }
              >
                {event.status}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {event.status !== "publicado" ? (
                <Button
                  size="sm"
                  onClick={() =>
                    updateEvent(event.id, { status: "publicado" })
                  }
                >
                  Publicar
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => updateEvent(event.id, { status: "rascunho" })}
                >
                  Despublicar
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  addEvent({
                    ...event,
                    id: `evt-copy-${Date.now()}`,
                    slug: `${event.slug}-copia`,
                    title: `${event.title} (cópia)`,
                    status: "rascunho",
                  })
                }
              >
                Duplicar
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link href={`/demo/eventos/${event.slug}`}>Ver público</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
