"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventSwitcher } from "@/components/admin/event-switcher";

export default function AdminTodayPage() {
  const {
    events,
    activeEventId,
    activeReservations,
    spaces,
    activePreparations,
  } = useDemo();
  const event = events.find((e) => e.id === activeEventId);
  const pending = activeReservations.filter((r) => r.status === "solicitada");
  const signal = activeReservations.filter(
    (r) => r.status === "aguardando_sinal" || r.awaitingSignal,
  );
  const confirmed = activeReservations.filter((r) =>
    ["confirmada", "cliente_chegou"].includes(r.status),
  );
  const arrived = activeReservations.filter((r) => r.status === "cliente_chegou");
  const birthdays = activeReservations.filter((r) => r.type === "aniversario");
  const prepPending = activePreparations.filter((p) =>
    ["pendente", "em_preparacao"].includes(p.status),
  );
  const free = spaces.filter((s) => s.status === "disponivel").length;
  const people = confirmed.reduce((acc, r) => acc + r.partySize, 0);

  const cards = [
    {
      label: "Solicitações pendentes",
      value: pending.length,
      href: "/demo/admin/reservas?filtro=novas",
      tone: "accent" as const,
    },
    {
      label: "Aguardando sinal",
      value: signal.length,
      href: "/demo/admin/reservas?filtro=sinal",
      tone: "warn" as const,
    },
    {
      label: "Confirmadas",
      value: confirmed.length,
      href: "/demo/admin/reservas?filtro=confirmadas",
      tone: "success" as const,
    },
    {
      label: "Pessoas esperadas",
      value: people,
      href: "/demo/admin/mapa",
      tone: "neutral" as const,
    },
    {
      label: "Preparação pendente",
      value: prepPending.length,
      href: "/demo/admin/preparacao",
      tone: "warn" as const,
    },
    {
      label: "Chegadas",
      value: arrived.length,
      href: "/demo/admin/reservas?filtro=chegaram",
      tone: "info" as const,
    },
    {
      label: "Espaços livres",
      value: free,
      href: "/demo/admin/mapa",
      tone: "neutral" as const,
    },
    {
      label: "Aniversários",
      value: birthdays.length,
      href: "/demo/admin/reservas?filtro=aniversarios",
      tone: "accent" as const,
    },
  ];

  if (!event) {
    return (
      <div className="px-4 py-6">
        <p className="text-[var(--fg-muted)]">Nenhum evento selecionado.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Visão de hoje
          </p>
          <h1 className="font-display text-3xl mt-1">{event.title}</h1>
          <p className="text-[var(--fg-muted)]">
            {event.dateLabel} · {event.timeLabel}
          </p>
          <div className="mt-3">
            <EventSwitcher />
          </div>
        </div>
        <Badge tone="success">Evento ativo</Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pending.some((r) => r.id === "RES-007") ? (
          <Button asChild size="sm">
            <Link href="/demo/admin/reservas/RES-007">Analisar Mariana</Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="secondary">
            <Link href="/demo/admin/reservas?filtro=novas">Ver pendências</Link>
          </Button>
        )}
        <Button asChild size="sm" variant="secondary">
          <Link href="/demo/admin/mapa">Abrir mapa</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/demo/admin/preparacao">Preparação</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/demo/admin/eventos/novo">Criar evento</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-[var(--surface-2)] min-h-24"
          >
            <p className="text-sm text-[var(--fg-muted)]">{card.label}</p>
            <p className="font-display mt-2 text-3xl text-[var(--fg)]">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-xl">Pendências prioritárias</h2>
        <ul className="mt-3 space-y-2">
          {pending.length === 0 ? (
            <li className="text-sm text-[var(--fg-muted)]">
              Nenhuma solicitação pendente.
            </li>
          ) : (
            pending.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/demo/admin/reservas/${r.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 min-h-12"
                >
                  <span className="font-semibold">
                    {r.responsibleName} · {r.id}
                  </span>
                  <span className="text-sm text-[var(--accent)]">Analisar</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
