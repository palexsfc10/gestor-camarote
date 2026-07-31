"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PrepStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const nextStatus: Partial<Record<PrepStatus, PrepStatus>> = {
  pendente: "em_preparacao",
  em_preparacao: "pronto",
  pronto: "entregue",
};

const labels: Record<PrepStatus, string> = {
  pendente: "Pendente",
  em_preparacao: "Em preparação",
  pronto: "Pronto",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export default function PreparacaoPage() {
  const { activePreparations, updatePrepStatus } = useDemo();
  const [view, setView] = useState<"reserva" | "item">("reserva");
  const preparations = activePreparations;

  const byReservation = useMemo(() => {
    const map = new Map<string, typeof preparations>();
    for (const p of preparations) {
      const list = map.get(p.reservationId) ?? [];
      list.push(p);
      map.set(p.reservationId, list);
    }
    return [...map.entries()];
  }, [preparations]);

  const byItem = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        total: number;
        pendente: number;
        pronto: number;
        lines: typeof preparations;
      }
    >();
    for (const p of preparations) {
      if (p.status === "cancelado") continue;
      const cur = map.get(p.catalogItemId) ?? {
        name: p.nameSnapshot,
        total: 0,
        pendente: 0,
        pronto: 0,
        lines: [],
      };
      cur.total += p.quantity;
      if (["pendente", "em_preparacao"].includes(p.status)) {
        cur.pendente += p.quantity;
      }
      if (["pronto", "entregue"].includes(p.status)) {
        cur.pronto += p.quantity;
      }
      cur.lines.push(p);
      map.set(p.catalogItemId, cur);
    }
    return [...map.values()];
  }, [preparations]);

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-3xl">Preparação</h1>
      <p className="mt-1 text-[var(--fg-muted)]">
        Celular/tablet friendly · duas visões
      </p>

      <div
        className="mt-4 inline-flex rounded-xl border border-[var(--border)] p-1"
        role="tablist"
      >
        {(
          [
            ["reserva", "Por reserva"],
            ["item", "Consolidada"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={view === id}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-semibold min-h-11",
              view === id
                ? "bg-[var(--accent)] text-[#1B1724]"
                : "text-[var(--fg-muted)]",
            )}
            onClick={() => setView(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "reserva" ? (
        <ul className="mt-4 space-y-3">
          {byReservation.length === 0 ? (
            <li className="text-sm text-[var(--fg-muted)] py-8 text-center">
              Nenhuma preparação para este evento ainda.
            </li>
          ) : null}
          {byReservation.map(([resId, lines]) => (
            <li
              key={resId}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-semibold">
                Espaço {lines[0]?.spaceCode} · {lines[0]?.responsible}
              </p>
              <p className="text-sm text-[var(--fg-muted)]">
                {lines[0]?.expectedArrival
                  ? `Chegada ${lines[0].expectedArrival}`
                  : resId}
              </p>
              <ul className="mt-3 space-y-2">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--surface-2)] px-3 py-3"
                  >
                    <div>
                      <p className="font-medium">
                        {line.quantity}× {line.nameSnapshot}
                      </p>
                      {line.notes ? (
                        <p className="text-xs text-[var(--muted)]">{line.notes}</p>
                      ) : null}
                      <Badge
                        tone={
                          line.status === "cancelado"
                            ? "danger"
                            : line.status === "pronto" ||
                                line.status === "entregue"
                              ? "success"
                              : "warn"
                        }
                        className="mt-1"
                      >
                        {labels[line.status]}
                      </Badge>
                    </div>
                    {nextStatus[line.status] ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          updatePrepStatus(line.id, nextStatus[line.status]!)
                        }
                      >
                        Marcar {labels[nextStatus[line.status]!]}
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 space-y-3">
          {byItem.map((item) => (
            <li
              key={item.name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-sm text-[var(--fg-muted)]">
                Total {item.total} · Pendente {item.pendente} · Pronto/entregue{" "}
                {item.pronto}
              </p>
              <ul className="mt-3 space-y-2">
                {item.lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span>
                      {line.spaceCode} · {line.responsible} · {line.quantity}× ·{" "}
                      {labels[line.status]}
                    </span>
                    {nextStatus[line.status] ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          updatePrepStatus(line.id, nextStatus[line.status]!)
                        }
                      >
                        Avançar
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
