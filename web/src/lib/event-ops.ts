import type { Reservation, SpaceStatus, VenueSpace } from "@/lib/types";

const OCCUPIED_STATUSES: Reservation["status"][] = [
  "solicitada",
  "aguardando_sinal",
  "confirmada",
  "cliente_chegou",
];

function spaceStatusFromReservation(
  status: Reservation["status"],
  awaitingSignal?: boolean,
): SpaceStatus {
  if (status === "cliente_chegou") return "ocupado";
  if (status === "confirmada") return "confirmado";
  if (status === "aguardando_sinal" || awaitingSignal) return "pre_reservado";
  if (status === "solicitada") return "pre_reservado";
  return "disponivel";
}

/** Reconstrói ocupação dos espaços estruturais a partir das reservas do evento. */
export function applySpaceOccupancyForEvent(
  structuralSpaces: VenueSpace[],
  reservations: Reservation[],
  eventId: string,
): VenueSpace[] {
  const active = reservations.filter(
    (r) => r.eventId === eventId && OCCUPIED_STATUSES.includes(r.status),
  );

  return structuralSpaces.map((space) => {
    if (space.blocked) {
      return { ...space, status: "bloqueado", reservationId: undefined };
    }
    const res = active.find((r) => r.spaceId === space.id);
    if (!res) {
      return { ...space, status: "disponivel", reservationId: undefined };
    }
    return {
      ...space,
      status: spaceStatusFromReservation(res.status, res.awaitingSignal),
      reservationId: res.id,
    };
  });
}

export function filterReservationsByEvent(
  reservations: Reservation[],
  eventId: string,
) {
  return reservations.filter((r) => r.eventId === eventId);
}

export function filterPreparationsByEvent<T extends { reservationId: string }>(
  preparations: T[],
  reservations: Reservation[],
  eventId: string,
): T[] {
  const ids = new Set(
    filterReservationsByEvent(reservations, eventId).map((r) => r.id),
  );
  return preparations.filter((p) => ids.has(p.reservationId));
}

export function spacesOfKind(spaces: VenueSpace[], kind: VenueSpace["kind"]) {
  return spaces.filter((s) => s.kind === kind);
}
