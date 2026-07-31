"use client";

import Link from "next/link";
import type { ConceptMeta } from "@/lib/concepts/public-data";
import { conceptMetas } from "@/lib/concepts/public-data";

export function ConceptSwitcher({
  active,
  tone = "dark",
}: {
  active: "a" | "b" | "c";
  tone?: "dark" | "light";
}) {
  const items = [
    { id: "a" as const, label: "A · Cinematic" },
    { id: "b" as const, label: "B · Editorial" },
    { id: "c" as const, label: "C · Urban" },
  ];
  const idle =
    tone === "light"
      ? "border border-[#1A1714]/25 text-[#1A1714]/80 hover:bg-[#1A1714]/5"
      : "border border-white/20 text-white/80 hover:bg-white/10";
  const activeCls =
    tone === "light"
      ? "bg-[#1A1714] text-[#F3EEE4]"
      : "bg-[#D4AF37] text-[#1B1724]";

  return (
    <nav
      aria-label="Comparar conceitos visuais"
      className="flex flex-wrap gap-2"
    >
      <Link
        href="/demo/conceitos"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold min-h-9 inline-flex items-center ${idle}`}
      >
        Índice
      </Link>
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/demo/conceitos/${item.id}`}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold min-h-9 inline-flex items-center ${
            active === item.id ? activeCls : idle
          }`}
        >
          {item.label}
        </Link>
      ))}
      <Link
        href="/demo"
        className={`rounded-full px-3 py-1.5 text-xs font-semibold min-h-9 inline-flex items-center ${idle}`}
      >
        Protótipo original
      </Link>
    </nav>
  );
}

export function ConceptMetaPanel({
  id,
  tone = "dark",
}: {
  id: "a" | "b" | "c";
  tone?: "dark" | "light";
}) {
  const meta: ConceptMeta = conceptMetas[id];
  const light = tone === "light";
  return (
    <aside
      className={`rounded-2xl border p-4 text-sm backdrop-blur ${
        light
          ? "border-[#1A1714]/15 bg-white/70 text-[#1A1714]"
          : "border-white/15 bg-black/40 text-white/90"
      }`}
      aria-label={`Direção ${meta.name}`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.2em] ${
          light ? "text-[#8B1E2D]" : "text-[#D4AF37]"
        }`}
      >
        Direção criativa
      </p>
      <h2
        className={`mt-1 font-semibold text-lg ${light ? "text-[#1A1714]" : "text-white"}`}
      >
        {meta.name}
      </h2>
      <p className={`mt-2 ${light ? "text-[#3D3830]" : "text-white/75"}`}>
        {meta.intention}
      </p>
      <p className="mt-3">
        <span className={light ? "text-[#5C564C]" : "text-white/50"}>
          Público percebido:{" "}
        </span>
        {meta.audience}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p
            className={`text-xs uppercase tracking-wider ${
              light ? "text-emerald-800" : "text-emerald-300/90"
            }`}
          >
            Pontos fortes
          </p>
          <ul
            className={`mt-1 list-disc pl-4 ${light ? "text-[#3D3830]" : "text-white/80"}`}
          >
            {meta.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p
            className={`text-xs uppercase tracking-wider ${
              light ? "text-amber-900" : "text-amber-200/90"
            }`}
          >
            Riscos
          </p>
          <ul
            className={`mt-1 list-disc pl-4 ${light ? "text-[#3D3830]" : "text-white/80"}`}
          >
            {meta.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export function StickyReserveBar({
  href,
  label = "Reservar agora",
  note,
}: {
  href: string;
  label?: string;
  note?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0E0C12]/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {note ? (
          <p className="min-w-0 flex-1 text-xs text-white/70">{note}</p>
        ) : null}
        <Link
          href={href}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[#D4AF37] px-4 text-sm font-bold text-[#1B1724]"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
