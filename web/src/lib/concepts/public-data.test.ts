import { describe, expect, it } from "vitest";
import {
  conceptUpcoming,
  conceptFeatured,
  conceptCombos,
} from "@/lib/concepts/public-data";

describe("concept public data", () => {
  it("uses the same featured narrative across concepts", () => {
    expect(conceptFeatured.title).toBe("Pagode do Piska");
    expect(conceptFeatured.dateLabel).toBe("Sábado, 15 de agosto");
    expect(conceptFeatured.timeLabel).toBe("Abertura às 20h");
    expect(conceptFeatured.availableCabins).toBe(2);
  });

  it("never includes draft-like events in upcoming list", () => {
    expect(conceptUpcoming.every((e) => !/rascunho/i.test(e.title))).toBe(true);
    expect(conceptUpcoming.some((e) => e.title === "Quinta Acústica")).toBe(
      false,
    );
  });

  it("keeps the three required combos", () => {
    expect(conceptCombos.map((c) => c.name)).toEqual([
      "Balde Premium",
      "Combo Neon",
      "Pacote Aniversário",
    ]);
  });
});
