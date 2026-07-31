"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDemo } from "@/lib/store/demo-store";
import { ReservationStatusBadge } from "@/components/status-badges";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/utils";
import { Suspense } from "react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";

function ReservationStatusInner() {
  const params = useParams<{ code: string }>();
  const { reservations, spaces, events } = useDemo();
  const reservation = reservations.find((r) => r.publicCode === params.code);
  const space = spaces.find((s) => s.id === reservation?.spaceId);
  const event = events.find((e) => e.id === reservation?.eventId);

  if (!reservation) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-white">
        <h1 className="font-display text-2xl">Solicitação não encontrada</h1>
        <p className="mt-2 text-white/60">
          No protótipo, o estado vive só nesta sessão do navegador.
        </p>
        <Button asChild className="mt-4">
          <Link href="/demo">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  const total =
    (space?.price ?? 0) +
    reservation.items.reduce(
      (acc, i) => acc + i.unitPriceSnapshot * i.quantity,
      0,
    );

  return (
    <div className="mx-auto max-w-lg px-4 py-6 text-white sm:py-8">
      <ReservationStatusBadge
        status={reservation.status}
        awaitingSignal={reservation.awaitingSignal}
      />
      <h1 className="font-display mt-3 text-[1.75rem] leading-tight sm:text-3xl">
        {reservation.status === "solicitada"
          ? "Solicitação enviada"
          : reservation.status === "confirmada"
            ? "Reserva confirmada pela casa"
            : "Acompanhamento"}
      </h1>
      {reservation.status === "solicitada" ? (
        <p
          className="mt-3 rounded-2xl border border-[#C9A962]/40 bg-[#C9A962]/10 p-4 text-[#E8D48A]"
          role="status"
        >
          Aguardando análise da casa. Sua reserva ainda não está confirmada.
        </p>
      ) : null}

      <dl className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-[#121014] p-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-white/50">Código</dt>
          <dd className="font-semibold">{reservation.publicCode}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-white/50">Evento</dt>
          <dd>{event?.title}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-white/50">Espaço</dt>
          <dd>{space?.name ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-white/50">Pessoas</dt>
          <dd>{reservation.partySize}</dd>
        </div>
        <div>
          <dt className="text-white/50">Adicionais</dt>
          <dd className="mt-1">
            <ul>
              {reservation.items.map((i) => (
                <li key={i.catalogItemId}>
                  {i.quantity}× {i.nameSnapshot}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
          <dt className="text-white/50">Total estimado</dt>
          <dd className="font-display text-lg text-[#C9A962]">
            {formatBRL(total)}
          </dd>
        </div>
      </dl>

      {reservation.signalInstructions ? (
        <p className="mt-4 rounded-xl border border-white/10 p-3 text-sm">
          Instruções de sinal: {reservation.signalInstructions}
        </p>
      ) : null}

      <p className="mt-4 text-xs text-white/40">
        Observações internas da casa nunca aparecem aqui.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button asChild variant="secondary">
          <Link href="/demo/admin/reservas">Ver no painel da casa</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/demo">Home da casa</Link>
        </Button>
      </div>
    </div>
  );
}

export default function ReservationPublicPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A090C] pb-8">
      <PublicHeader />
      <Suspense>
        <ReservationStatusInner />
      </Suspense>
      <PublicFooter />
    </div>
  );
}
