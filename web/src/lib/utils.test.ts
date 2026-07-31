import { describe, expect, it } from "vitest";
import {
  initialPreparations,
  initialReservations,
  initialSpaces,
  structuralSpaces,
} from "@/lib/mock/seed";
import { formatBRL, maskPhone } from "@/lib/utils";

describe("demo narrative seed", () => {
  it("starts Camarote 07 available without RES-007", () => {
    const c07 = initialSpaces.find((s) => s.code === "07");
    expect(c07?.status).toBe("disponivel");
    expect(c07?.kind).toBe("camarote");
    expect(c07?.reservationId).toBeUndefined();
    expect(initialReservations.some((r) => r.id === "RES-007")).toBe(false);
  });

  it("has no Mariana preparation lines", () => {
    expect(
      initialPreparations.some((p) =>
        p.responsible.toLowerCase().includes("mariana"),
      ),
    ).toBe(false);
  });

  it("exposes camarotes and mesas as structural spaces", () => {
    expect(structuralSpaces.filter((s) => s.kind === "camarote")).toHaveLength(
      8,
    );
    expect(structuralSpaces.filter((s) => s.kind === "mesa")).toHaveLength(4);
    expect(initialSpaces).toHaveLength(12);
  });
});

describe("utils", () => {
  it("formats BRL", () => {
    expect(formatBRL(89.9)).toContain("89");
  });

  it("masks phone", () => {
    expect(maskPhone("(11) 98888-0007")).toContain("*****-0007");
  });
});
