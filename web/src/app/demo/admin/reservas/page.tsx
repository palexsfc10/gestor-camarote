"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useDemo } from "@/lib/store/demo-store";
import { ReservationStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Reservation } from "@/lib/types";

const filters = [
  { id: "todas", label: "Todas" },
  { id: "novas", label: "Novas" },
  { id: "sinal", label: "Aguardando sinal" },
  { id: "confirmadas", label: "Confirmadas" },
  { id: "aniversarios", label: "Aniversários" },
  { id: "chegaram", label: "Chegaram" },
  { id: "canceladas", label: "Canceladas" },
  { id: "noshow", label: "No-show" },
] as const;

function matchFilter(r: Reservation, filtro: string) {
  switch (filtro) {
    case "novas":
      return r.status === "solicitada";
    case "sinal":
      return r.status === "aguardando_sinal" || !!r.awaitingSignal;
    case "confirmadas":
      return r.status === "confirmada";
    case "aniversarios":
      return r.type === "aniversario";
    case "chegaram":
      return r.status === "cliente_chegou";
    case "canceladas":
      return r.status === "cancelada" || r.status === "recusada";
    case "noshow":
      return r.status === "no_show";
    default:
      return true;
  }
}

function ReservasInner() {
  const search = useSearchParams();
  const initial = search.get("filtro") ?? "todas";
  const [filtro, setFiltro] = useState(initial);
  const [q, setQ] = useState("");
  const { activeReservations, spaces } = useDemo();

  const list = useMemo(() => {
    return activeReservations.filter((r) => {
      if (!matchFilter(r, filtro)) return false;
      if (!q.trim()) return true;
      const space = spaces.find((s) => s.id === r.spaceId);
      const hay = `${r.responsibleName} ${r.phone} ${space?.name ?? ""} ${r.id}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [filtro, q, activeReservations, spaces]);

  return (
    <div className="px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Reservas</h1>
        <Button asChild size="sm" variant="secondary">
          <Link href="/demo/admin/reservas?filtro=novas">Pendências</Link>
        </Button>
      </div>

      <div className="mt-4">
        <Input
          placeholder="Buscar nome, telefone ou espaço…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar reservas"
        />
      </div>

      <div className="mt-4 grid gap-6 lg:grid-cols-[14rem_1fr]">
        <div
          className="mt-0 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
          role="tablist"
          aria-label="Filtros de reservas"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filtro === f.id}
              onClick={() => setFiltro(f.id)}
              className={`shrink-0 rounded-full border px-3 py-2.5 text-xs font-semibold min-h-11 lg:rounded-xl lg:text-left lg:w-full ${
                filtro === f.id
                  ? "border-[var(--accent)] bg-[var(--surface-2)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--fg-muted)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      <ul className="space-y-2">
        {list.map((r) => {
          const space = spaces.find((s) => s.id === r.spaceId);
          return (
            <li key={r.id}>
              <Link
                href={`/demo/admin/reservas/${r.id}`}
                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-[var(--surface-2)] min-h-16"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{r.responsibleName}</p>
                    <p className="text-sm text-[var(--fg-muted)]">
                      {space?.name ?? "Sem espaço"} · {r.partySize} pess. ·{" "}
                      {r.type}
                    </p>
                  </div>
                  <ReservationStatusBadge
                    status={r.status}
                    awaitingSignal={r.awaitingSignal}
                  />
                </div>
                {r.items.length > 0 ? (
                  <p className="mt-2 text-xs text-[var(--muted)]">
                    {r.items.map((i) => `${i.quantity}× ${i.nameSnapshot}`).join(" · ")}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
        {list.length === 0 ? (
          <li className="text-sm text-[var(--fg-muted)] py-8 text-center">
            {filtro === "todas"
              ? "Nenhuma reserva para este evento ainda."
              : "Nenhuma reserva neste filtro."}
          </li>
        ) : null}
      </ul>
      </div>
    </div>
  );
}

export default function AdminReservasPage() {
  return (
    <Suspense>
      <ReservasInner />
    </Suspense>
  );
}
