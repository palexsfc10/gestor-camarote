"use client";

import { useDemo } from "@/lib/store/demo-store";

export function EventSwitcher({ className }: { className?: string }) {
  const { events, activeEventId, setActiveEventId, setToast } = useDemo();

  return (
    <label className={className}>
      <span className="sr-only">Evento operacional</span>
      <select
        data-testid="event-switcher"
        value={activeEventId}
        onChange={(e) => {
          setActiveEventId(e.target.value);
          setToast("Evento operacional alterado.");
        }}
        className="min-h-11 w-full max-w-xs rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--fg)]"
      >
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
            {event.status === "rascunho" ? " (rascunho)" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
