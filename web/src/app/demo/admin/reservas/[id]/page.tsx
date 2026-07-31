"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Label, Textarea } from "@/components/ui/input";
import { ReservationStatusBadge } from "@/components/status-badges";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatBRL, maskPhone } from "@/lib/utils";

export default function ReservationDetailPage() {
  const params = useParams<{ id: string }>();
  const demo = useDemo();
  const reservation = demo.reservations.find((r) => r.id === params.id);
  const space = demo.spaces.find((s) => s.id === reservation?.spaceId);
  const [showPhone, setShowPhone] = useState(false);
  const [dialog, setDialog] = useState<
    null | "confirm" | "refuse" | "cancel" | "noshow" | "checkin" | "signal" | "move"
  >(null);
  const [signalText, setSignalText] = useState(
    "Pix R$ 200 (simulado) — enviar comprovante no WhatsApp da casa.",
  );
  const [moveTo, setMoveTo] = useState("");
  const [internalNotes, setInternalNotes] = useState(
    reservation?.internalNotes ?? "",
  );

  const availableTargets = useMemo(
    () => demo.spaces.filter((s) => s.status === "disponivel"),
    [demo.spaces],
  );

  if (!reservation) {
    return (
      <div className="px-4 py-10">
        <h1 className="font-display text-2xl">Reserva não encontrada</h1>
        <Button asChild className="mt-4">
          <Link href="/demo/admin/reservas">Voltar</Link>
        </Button>
      </div>
    );
  }

  const total =
    (space?.price ?? 0) +
    reservation.items.reduce(
      (a, i) => a + i.unitPriceSnapshot * i.quantity,
      0,
    );

  return (
    <div className="px-4 py-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--muted)]">{reservation.id}</p>
          <h1 className="font-display text-3xl">{reservation.responsibleName}</h1>
        </div>
        <ReservationStatusBadge
          status={reservation.status}
          awaitingSignal={reservation.awaitingSignal}
        />
      </div>

      {(reservation.status === "solicitada" ||
        reservation.awaitingSignal) && (
        <p
          className="mt-4 rounded-xl border border-[var(--accent)]/30 bg-[var(--surface-2)] px-3 py-2 text-sm"
          role="status"
        >
          Ação necessária: analisar solicitação
          {reservation.awaitingSignal ? " / sinal" : ""}.
        </p>
      )}

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="font-semibold">Dados</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--muted)]">Telefone</dt>
              <dd>
                {showPhone ? reservation.phone : maskPhone(reservation.phone)}{" "}
                <button
                  type="button"
                  className="text-[var(--accent)] underline text-xs"
                  onClick={() => setShowPhone((v) => !v)}
                >
                  {showPhone ? "Ocultar" : "Mostrar"}
                </button>
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--muted)]">Tipo</dt>
              <dd>{reservation.type}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--muted)]">Pessoas</dt>
              <dd>{reservation.partySize}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[var(--muted)]">Chegada</dt>
              <dd>{reservation.expectedArrival ?? "—"}</dd>
            </div>
            {reservation.celebrationName ? (
              <div className="flex justify-between gap-2">
                <dt className="text-[var(--muted)]">Aniversário</dt>
                <dd>{reservation.celebrationName}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="font-semibold">Espaço</h2>
          <p className="mt-3 text-lg font-display">{space?.name ?? "—"}</p>
          <p className="text-sm text-[var(--fg-muted)]">
            {space ? formatBRL(space.price) : null}
          </p>
          <Button
            className="mt-3"
            size="sm"
            variant="secondary"
            onClick={() => setDialog("move")}
          >
            Propor outro espaço
          </Button>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="font-semibold">Adicionais (snapshot)</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {reservation.items.map((i) => (
            <li key={i.catalogItemId}>
              {i.quantity}× {i.nameSnapshot} —{" "}
              {formatBRL(i.unitPriceSnapshot * i.quantity)}
            </li>
          ))}
        </ul>
        <p className="mt-3 font-display text-[var(--accent)]">
          Total estimado {formatBRL(total)}
        </p>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="font-semibold">Observações públicas</h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            {reservation.publicNotes || "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="font-semibold">Observações internas</h2>
          <Textarea
            className="mt-2"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            aria-label="Observações internas"
          />
          <p className="mt-2 text-xs text-[var(--muted)]">
            Nunca exibidas ao cliente.
          </p>
        </div>
      </section>

      {reservation.guestNames.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h2 className="font-semibold">Convidados</h2>
          <p className="mt-2 text-sm text-[var(--fg-muted)]">
            {reservation.guestNames.join(", ")}
          </p>
        </section>
      ) : null}

      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="font-semibold">Histórico</h2>
        <ol className="mt-2 space-y-1 text-sm text-[var(--fg-muted)]">
          {reservation.history.map((h) => (
            <li key={`${h.at}-${h.text}`}>
              {h.at} — {h.text}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 flex flex-wrap gap-2 pb-28 md:pb-0 md:static">
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-[var(--border)] bg-[var(--bg)]/95 p-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:inset-auto md:z-auto md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
        {["solicitada", "aguardando_sinal"].includes(reservation.status) ? (
          <>
            <Button className="min-h-11" onClick={() => setDialog("confirm")}>Confirmar</Button>
            <Button className="min-h-11" variant="secondary" onClick={() => setDialog("signal")}>
              Aguardar sinal
            </Button>
            <Button className="min-h-11" variant="danger" onClick={() => setDialog("refuse")}>
              Recusar
            </Button>
          </>
        ) : null}
        {reservation.status === "confirmada" ? (
          <>
            <Button className="min-h-11" onClick={() => setDialog("checkin")}>Registrar chegada</Button>
            <Button className="min-h-11" variant="danger" onClick={() => setDialog("noshow")}>
              No-show
            </Button>
          </>
        ) : null}
        {!["cancelada", "recusada", "no_show"].includes(reservation.status) ? (
          <Button className="min-h-11" variant="outline" onClick={() => setDialog("cancel")}>
            Cancelar
          </Button>
        ) : null}
        <Button asChild variant="ghost" className="min-h-11">
          <Link href="/demo/admin/mapa">Ver no mapa</Link>
        </Button>
          </div>
        </div>
      </section>

      <ConfirmDialog
        open={dialog === "confirm"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Confirmar reserva?"
        confirmLabel="Confirmar reserva"
        tone="success"
        consequences={[
          `Confirmar esta reserva tornará o ${space?.name ?? "espaço"} indisponível para novas solicitações e enviará os itens para Preparação.`,
          "O cliente verá o status como confirmada pela casa.",
        ]}
        onConfirm={() => demo.confirmReservation(reservation.id)}
      />
      <ConfirmDialog
        open={dialog === "refuse"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Recusar solicitação?"
        confirmLabel="Recusar"
        tone="danger"
        consequences={[
          `${space?.name ?? "Espaço"} voltará a ficar disponível.`,
          "O cliente verá que não foi possível confirmar.",
        ]}
        onConfirm={() => demo.refuseReservation(reservation.id)}
      />
      <ConfirmDialog
        open={dialog === "cancel"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Cancelar reserva?"
        confirmLabel="Cancelar reserva"
        tone="danger"
        consequences={[
          `Cancelar liberará o ${space?.name ?? "espaço"} e cancelará itens de preparação ainda pendentes.`,
        ]}
        onConfirm={() => demo.cancelReservation(reservation.id)}
      />
      <ConfirmDialog
        open={dialog === "noshow"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Registrar no-show?"
        confirmLabel="Registrar no-show"
        tone="danger"
        consequences={[
          "O espaço voltará a ficar disponível.",
          "Preparação pendente será cancelada.",
        ]}
        onConfirm={() => demo.markNoShow(reservation.id)}
      />
      <ConfirmDialog
        open={dialog === "checkin"}
        onOpenChange={(o) => !o && setDialog(null)}
        title="Registrar chegada?"
        confirmLabel="Confirmar chegada"
        tone="success"
        consequences={[
          `${reservation.responsibleName} será marcada como chegou.`,
          `${space?.name ?? "Espaço"} ficará ocupado no mapa.`,
        ]}
        onConfirm={() => demo.checkInReservation(reservation.id)}
      />

      {dialog === "signal" ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal
            aria-labelledby="signal-title"
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <h2 id="signal-title" className="font-display text-xl">
              Aguardar sinal
            </h2>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              O espaço permanece pré-reservado. Isto é um alerta da reserva, não
              um status físico novo do mapa.
            </p>
            <Label htmlFor="signal" className="mt-4">
              Instruções ao cliente
            </Label>
            <Textarea
              id="signal"
              value={signalText}
              onChange={(e) => setSignalText(e.target.value)}
            />
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDialog(null)}>
                Voltar
              </Button>
              <Button
                onClick={() => {
                  demo.setAwaitingSignal(reservation.id, signalText);
                  setDialog(null);
                }}
              >
                Salvar status
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {dialog === "move" ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <h2 className="font-display text-xl">Propor outro espaço</h2>
            <Label htmlFor="moveTo" className="mt-4">
              Destino disponível
            </Label>
            <select
              id="moveTo"
              className="mt-1 flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3"
              value={moveTo}
              onChange={(e) => setMoveTo(e.target.value)}
            >
              <option value="">Selecione…</option>
              {availableTargets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setDialog(null)}>
                Voltar
              </Button>
              <Button
                disabled={!moveTo}
                onClick={() => {
                  demo.proposeSpace(reservation.id, moveTo);
                  setDialog(null);
                }}
              >
                Confirmar troca
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
