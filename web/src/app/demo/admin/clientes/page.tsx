"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store/demo-store";
import { Input } from "@/components/ui/input";
import { maskPhone } from "@/lib/utils";

export default function ClientesPage() {
  const { customers } = useDemo();
  const [q, setQ] = useState("");
  const list = customers.filter((c) =>
    `${c.name} ${c.phone}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-3xl">Clientes</h1>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Histórico leve — não é CRM
      </p>
      <div className="mt-4">
        <Input
          placeholder="Buscar nome ou telefone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar clientes"
        />
      </div>
      <ul className="mt-4 space-y-2">
        {list.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-[var(--fg-muted)]">
              {maskPhone(c.phone)} · {c.reservations} reserva(s) · última{" "}
              {c.lastVisit}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
