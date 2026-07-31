"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Map,
  MoreHorizontal,
  ClipboardList,
  Soup,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";

const primary = [
  { href: "/demo/admin", label: "Hoje", icon: LayoutDashboard, exact: true },
  { href: "/demo/admin/reservas", label: "Reservas", icon: ClipboardList },
  { href: "/demo/admin/mapa", label: "Mapa", icon: Map },
  { href: "/demo/admin/preparacao", label: "Prep.", icon: Soup },
  { href: "/demo/admin/eventos", label: "Eventos", icon: CalendarDays },
];

const gestao = [
  { href: "/demo/admin/cardapio", label: "Cardápio" },
  { href: "/demo/admin/site", label: "Site" },
  { href: "/demo/admin/clientes", label: "Clientes" },
  { href: "/demo/admin/configuracoes", label: "Configurações" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const isMap = pathname.startsWith("/demo/admin/mapa");

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[calc(100vh-6rem)] w-full flex-col md:flex-row",
        isMap ? "max-w-[1440px]" : "max-w-6xl",
      )}
    >
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-[var(--border)] p-4 gap-1 lg:w-60">
        <p className="mb-2 text-xs uppercase tracking-wider text-[var(--muted)]">
          Operação
        </p>
        {primary.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-semibold min-h-11 flex items-center gap-2",
              isActive(item.href, item.exact)
                ? "bg-[var(--surface-2)] text-[var(--accent)]"
                : "text-[var(--fg-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        ))}
        <p className="mb-2 mt-4 text-xs uppercase tracking-wider text-[var(--muted)]">
          Gestão
        </p>
        {gestao.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-3 py-2.5 text-sm font-semibold min-h-11",
              isActive(item.href)
                ? "bg-[var(--surface-2)] text-[var(--accent)]"
                : "text-[var(--fg-muted)] hover:bg-[var(--surface-2)]",
            )}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      <div className="flex-1 min-w-0 pb-28 md:pb-8">{children}</div>

      <nav
        className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]"
        aria-label="Navegação principal"
      >
        <ul className="grid grid-cols-6 gap-0 px-1 py-1">
          {primary.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-semibold min-h-14",
                  isActive(item.href, item.exact)
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)]",
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Button
              type="button"
              variant="ghost"
              className="flex h-full w-full flex-col gap-0.5 rounded-lg py-2 text-[10px] font-semibold min-h-14 text-[var(--muted)]"
              onClick={() => setMoreOpen(true)}
              aria-expanded={moreOpen}
            >
              <MoreHorizontal className="h-5 w-5" />
              Mais
            </Button>
          </li>
        </ul>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen} title="Gestão">
        <ul className="space-y-1">
          {gestao.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold text-[var(--fg)] hover:bg-[var(--surface-2)]"
                onClick={() => setMoreOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Sheet>
    </div>
  );
}
