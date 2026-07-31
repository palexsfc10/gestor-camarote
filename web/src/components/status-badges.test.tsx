/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DemoProvider } from "@/lib/store/demo-store";
import { SpaceStatusBadge } from "@/components/status-badges";

describe("SpaceStatusBadge", () => {
  it("shows textual status not only color", () => {
    render(
      <DemoProvider>
        <SpaceStatusBadge status="pre_reservado" />
      </DemoProvider>,
    );
    expect(screen.getByText("Pré-reservado")).toBeTruthy();
  });
});
