"use client";

import { useDemo } from "@/lib/store/demo-store";
import { SpaceStatusBadge } from "@/components/status-badges";

export default function ConfigPage() {
  const { site, spaces } = useDemo();

  return (
    <div className="px-4 py-6 max-w-2xl">
      <h1 className="font-display text-3xl">Configurações</h1>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Protótipo · mapa configurado pela NTWS (readonly)
      </p>

      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="font-semibold">Estabelecimento</h2>
        <p className="mt-2 text-sm text-[var(--fg-muted)]">{site.name}</p>
        <p className="text-sm text-[var(--fg-muted)]">{site.address}</p>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="font-semibold">Espaços</h2>
        <ul className="mt-3 space-y-2">
          {spaces.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span>
                {s.name} · até {s.capacity} pessoas
              </span>
              <SpaceStatusBadge status={s.status} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h2 className="font-semibold">Preferências (hipóteses)</h2>
        <ul className="mt-2 space-y-1 text-sm text-[var(--fg-muted)]">
          <li>TTL de pré-reserva: 12 horas (hipótese visual)</li>
          <li>CPF: condicional — não coletado neste protótipo</li>
          <li>Equipe: login real fora de escopo</li>
        </ul>
      </section>
    </div>
  );
}
