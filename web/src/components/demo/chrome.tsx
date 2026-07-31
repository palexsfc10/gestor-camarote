"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/store/demo-store";

export function DemoBanner() {
  const { resetDemo } = useDemo();
  return (
    <div
      className="border-b border-[var(--border)] bg-[#2A2010] px-3 py-2 text-xs sm:text-sm text-[#F0D58A]"
      role="status"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 sm:justify-between">
        <p className="text-center sm:text-left">
          Demonstração visual NTWS Labs · dados fictícios · sem backend
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.confirm(
                "Reiniciar a demonstração e restaurar o estado inicial?",
              )
            ) {
              resetDemo();
            }
          }}
          className="shrink-0 text-[10px] sm:text-xs underline underline-offset-2 text-[#E8D48A]/80 hover:text-[#E8D48A] min-h-8"
        >
          Reiniciar demonstração
        </button>
      </div>
    </div>
  );
}

export function ModeSwitcher() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/demo/admin");
  return (
    <div
      className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
      role="group"
      aria-label="Alternar experiência"
    >
      <Link
        href="/demo"
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-semibold min-h-9 inline-flex items-center",
          !isAdmin
            ? "bg-[var(--accent)] text-[#1B1724]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
        )}
      >
        Cliente
      </Link>
      <Link
        href="/demo/admin"
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-semibold min-h-9 inline-flex items-center",
          isAdmin
            ? "bg-[var(--accent)] text-[#1B1724]"
            : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
        )}
      >
        Painel da casa
      </Link>
    </div>
  );
}

export function ToastHost() {
  const { toast, setToast } = useDemo();
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-20 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--fg)] shadow-lg md:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <p>{toast}</p>
        <button
          type="button"
          className="text-[var(--muted)] underline text-xs"
          onClick={() => setToast(null)}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
