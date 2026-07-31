"use client";

import { useMemo, useState } from "react";
import type { VenueSpace } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SpaceStatusBadge } from "@/components/status-badges";
import { useDemo } from "@/lib/store/demo-store";

const fill: Record<VenueSpace["status"], string> = {
  disponivel: "#2A2633",
  pre_reservado: "#6B5420",
  confirmado: "#2F6B4F",
  ocupado: "#2A4A6B",
  bloqueado: "#4A3030",
  manutencao: "#4A3030",
};

export function VenueMap({
  selectedId,
  onSelect,
  className,
}: {
  selectedId?: string | null;
  onSelect: (space: VenueSpace) => void;
  className?: string;
}) {
  const { spaces, spaceStatusLabel } = useDemo();
  const mapSpaces = useMemo(
    () => spaces.filter((s) => s.kind === "camarote" && s.map.w > 0),
    [spaces],
  );

  return (
    <div className={cn("w-full", className)}>
      <svg
        viewBox="0 0 400 280"
        role="img"
        aria-label="Mapa da casa com palco, backstage e oito camarotes"
        className="w-full rounded-2xl border border-[var(--border)] bg-[#120F18]"
      >
        <rect x="120" y="8" width="160" height="28" rx="6" fill="#3A3428" />
        <text
          x="200"
          y="27"
          textAnchor="middle"
          fill="#E8D48A"
          fontSize="12"
          fontFamily="inherit"
        >
          BACKSTAGE
        </text>

        <rect x="80" y="110" width="240" height="56" rx="10" fill="#2A2430" stroke="#D4AF37" strokeWidth="1.5" />
        <text
          x="200"
          y="143"
          textAnchor="middle"
          fill="#F5F0E8"
          fontSize="16"
          fontWeight="600"
        >
          PALCO
        </text>

        {mapSpaces.map((space) => {
          const selected = selectedId === space.id;
          return (
            <g key={space.id}>
              <rect
                x={space.map.x}
                y={space.map.y}
                width={space.map.w}
                height={space.map.h}
                rx="8"
                fill={fill[space.status]}
                stroke={selected ? "#D4AF37" : "#5A5266"}
                strokeWidth={selected ? 3 : 1}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`${space.name}, ${spaceStatusLabel(space.status)}`}
                onClick={() => onSelect(space)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(space);
                  }
                }}
              />
              <text
                x={space.map.x + space.map.w / 2}
                y={space.map.y + 22}
                textAnchor="middle"
                fill="#F5F0E8"
                fontSize="13"
                fontWeight="700"
                className="pointer-events-none"
              >
                C{space.code}
              </text>
              <text
                x={space.map.x + space.map.w / 2}
                y={space.map.y + 38}
                textAnchor="middle"
                fill="#D6D0C4"
                fontSize="10"
                className="pointer-events-none"
              >
                {spaceStatusLabel(space.status)}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Legenda do mapa">
        {(
          [
            "disponivel",
            "pre_reservado",
            "confirmado",
            "ocupado",
            "bloqueado",
            "manutencao",
          ] as VenueSpace["status"][]
        ).map((s) => (
          <li key={s}>
            <SpaceStatusBadge status={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpaceList({
  selectedId,
  onSelect,
  onlyAvailable,
  kind,
}: {
  selectedId?: string | null;
  onSelect: (space: VenueSpace) => void;
  onlyAvailable?: boolean;
  kind?: VenueSpace["kind"];
}) {
  const { spaces } = useDemo();
  const list = useMemo(() => {
    let next = spaces;
    if (kind) next = next.filter((s) => s.kind === kind);
    if (onlyAvailable) next = next.filter((s) => s.status === "disponivel");
    return next;
  }, [kind, onlyAvailable, spaces]);

  return (
    <ul className="space-y-2">
      {list.map((space) => (
        <li key={space.id}>
          <button
            type="button"
            onClick={() => onSelect(space)}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left min-h-12 transition-colors",
              selectedId === space.id
                ? "border-[var(--accent)] bg-[var(--surface-2)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]",
            )}
          >
            <span className="font-semibold text-[var(--fg)]">{space.name}</span>
            <SpaceStatusBadge status={space.status} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function MapViewToggle({
  onSelect,
  selectedId,
  showReserveCta,
}: {
  onSelect: (space: VenueSpace) => void;
  selectedId?: string | null;
  showReserveCta?: boolean;
}) {
  const [mode, setMode] = useState<"mapa" | "lista">("mapa");
  return (
    <div>
      {/* Mobile: mapa OU lista. Tablet+: ambos (operação de evento). */}
      <div
        className="mb-3 inline-flex rounded-xl border border-[var(--border)] p-1 md:hidden"
        role="tablist"
        aria-label="Visualização de espaços"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "mapa"}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-semibold min-h-11",
            mode === "mapa"
              ? "bg-[var(--accent)] text-[#1B1724]"
              : "text-[var(--fg-muted)]",
          )}
          onClick={() => setMode("mapa")}
        >
          Mapa
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "lista"}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-semibold min-h-11",
            mode === "lista"
              ? "bg-[var(--accent)] text-[#1B1724]"
              : "text-[var(--fg-muted)]",
          )}
          onClick={() => setMode("lista")}
        >
          Lista
        </button>
      </div>

      <div className="md:hidden">
        {mode === "mapa" ? (
          <VenueMap selectedId={selectedId} onSelect={onSelect} />
        ) : (
          <SpaceList selectedId={selectedId} onSelect={onSelect} />
        )}
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-[1.4fr_0.9fr] lg:grid-cols-[1.5fr_0.85fr]">
        <VenueMap selectedId={selectedId} onSelect={onSelect} />
        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-[var(--muted)]">
            Lista rápida
          </p>
          <SpaceList selectedId={selectedId} onSelect={onSelect} />
        </div>
      </div>
      {showReserveCta ? null : null}
    </div>
  );
}
