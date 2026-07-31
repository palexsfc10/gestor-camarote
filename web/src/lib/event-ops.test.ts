import { describe, expect, it } from "vitest";
import {
  applySpaceOccupancyForEvent,
  filterPreparationsByEvent,
  filterReservationsByEvent,
  spacesOfKind,
} from "@/lib/event-ops";
import {
  EMPTY_EVENT_ID,
  EVENT_ID,
  initialPreparations,
  initialReservations,
  initialSite,
  structuralSpaces,
} from "@/lib/mock/seed";

describe("event operational isolation", () => {
  it("keeps structural spaces across events", () => {
    expect(structuralSpaces).toHaveLength(12);
    expect(spacesOfKind(structuralSpaces, "camarote")).toHaveLength(8);
    expect(spacesOfKind(structuralSpaces, "mesa")).toHaveLength(4);
    expect(initialSite.name).toBe("Pérola Gastrobar");
  });

  it("filters reservations and preparations by event", () => {
    const pagode = filterReservationsByEvent(initialReservations, EVENT_ID);
    const empty = filterReservationsByEvent(initialReservations, EMPTY_EVENT_ID);
    expect(pagode.length).toBeGreaterThan(0);
    expect(empty).toHaveLength(0);

    expect(
      filterPreparationsByEvent(
        initialPreparations,
        initialReservations,
        EVENT_ID,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      filterPreparationsByEvent(
        initialPreparations,
        initialReservations,
        EMPTY_EVENT_ID,
      ),
    ).toHaveLength(0);
  });

  it("empty event starts without occupancy from other nights", () => {
    const spaces = applySpaceOccupancyForEvent(
      structuralSpaces,
      initialReservations,
      EMPTY_EVENT_ID,
    );
    const occupied = spaces.filter(
      (s) => s.status !== "disponivel" && !s.blocked,
    );
    expect(occupied).toHaveLength(0);
    expect(spaces.find((s) => s.id === "sp-06")?.status).toBe("bloqueado");
  });

  it("pagode event applies reservation occupancy", () => {
    const spaces = applySpaceOccupancyForEvent(
      structuralSpaces,
      initialReservations,
      EVENT_ID,
    );
    expect(spaces.find((s) => s.id === "sp-01")?.status).toBe("confirmado");
    expect(spaces.find((s) => s.id === "mesa-01")?.status).toBe("confirmado");
    expect(spaces.find((s) => s.id === "sp-07")?.status).toBe("disponivel");
  });
});

describe("mesa vs camarote kinds", () => {
  it("mesa spaces are not camarotes", () => {
    const mesas = spacesOfKind(structuralSpaces, "mesa");
    expect(mesas.every((s) => s.name.startsWith("Mesa"))).toBe(true);
    expect(mesas.some((s) => s.name.includes("Camarote"))).toBe(false);
  });

  it("camarote spaces are not mesas", () => {
    const camarotes = spacesOfKind(structuralSpaces, "camarote");
    expect(camarotes.every((s) => s.name.startsWith("Camarote"))).toBe(true);
    expect(camarotes.some((s) => s.name.includes("Mesa"))).toBe(false);
  });
});
