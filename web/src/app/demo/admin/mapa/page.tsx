"use client";

import { useState } from "react";
import Link from "next/link";
import { MapViewToggle } from "@/components/map/venue-map";
import { useDemo } from "@/lib/store/demo-store";
import type { VenueSpace } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { SpaceStatusBadge, ReservationStatusBadge } from "@/components/status-badges";
import { maskPhone } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function AdminMapPage() {
  const demo = useDemo();
  const [selected, setSelected] = useState<VenueSpace | null>(null);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const reservation = demo.reservations.find(
    (r) => r.id === selected?.reservationId,
  );

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-3xl">Mapa da casa</h1>
      <p className="mt-1 text-[var(--fg-muted)]">
        Pagode do Piska · template NTWS (SVG) + lista alternativa
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.35fr_0.75fr]">
        <MapViewToggle
          selectedId={selected?.id}
          onSelect={(s) => setSelected(s)}
        />

        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 md:sticky md:top-24 h-fit">
          <p className="mb-3 text-xs uppercase tracking-wider text-[var(--muted)]">
            Detalhe do espaço
          </p>
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-2xl">{selected.name}</h2>
                <SpaceStatusBadge status={selected.status} />
              </div>
              {reservation ? (
                <>
                  <ReservationStatusBadge
                    status={reservation.status}
                    awaitingSignal={reservation.awaitingSignal}
                  />
                  {reservation.awaitingSignal ? (
                    <p className="text-sm text-[#F0D58A]">
                      Alerta de reserva: aguardando sinal (espaço continua
                      pré-reservado).
                    </p>
                  ) : null}
                  <p className="font-semibold">{reservation.responsibleName}</p>
                  <p className="text-sm text-[var(--fg-muted)]">
                    {maskPhone(reservation.phone)} · {reservation.partySize}{" "}
                    pessoas
                    {reservation.expectedArrival
                      ? ` · ${reservation.expectedArrival}`
                      : ""}
                  </p>
                  <ul className="text-sm text-[var(--fg-muted)]">
                    {reservation.items.map((i) => (
                      <li key={i.catalogItemId}>
                        {i.quantity}× {i.nameSnapshot}
                      </li>
                    ))}
                  </ul>
                  {reservation.internalNotes ? (
                    <p className="rounded-xl bg-[var(--surface-2)] p-3 text-sm">
                      Interna: {reservation.internalNotes}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild>
                      <Link href={`/demo/admin/reservas/${reservation.id}`}>
                        Abrir reserva
                      </Link>
                    </Button>
                    {reservation.status === "confirmada" ? (
                      <Button
                        variant="secondary"
                        onClick={() => setCheckInOpen(true)}
                      >
                        Registrar chegada
                      </Button>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-[var(--fg-muted)]">
                    Sem reserva vinculada.
                  </p>
                  {selected.status === "disponivel" ? (
                    <Button asChild>
                      <Link
                        href={`/demo/reservar/pagode-do-piska?space=${selected.id}`}
                      >
                        Iniciar reserva (cliente)
                      </Link>
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-muted)]">
              Selecione um camarote no mapa ou na lista.
            </p>
          )}
        </aside>
      </div>

      {reservation ? (
        <ConfirmDialog
          open={checkInOpen}
          onOpenChange={setCheckInOpen}
          title="Registrar chegada?"
          confirmLabel="Chegou"
          tone="success"
          consequences={[
            `${reservation.responsibleName} no ${selected?.name}.`,
            "O mapa marcará o espaço como ocupado.",
          ]}
          onConfirm={() => demo.checkInReservation(reservation.id)}
        />
      ) : null}
    </div>
  );
}
