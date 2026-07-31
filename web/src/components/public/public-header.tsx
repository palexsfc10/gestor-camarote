"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { perolaAssets } from "@/lib/perola/public-content";
import { EVENT_SLUG } from "@/lib/mock/seed";
import { cn } from "@/lib/utils";
import { PublicPrimaryLink } from "@/components/public/public-cta";

const links = [
  { href: "/demo/eventos", label: "Eventos", match: "/demo/eventos" },
  { href: "/demo#experiencias", label: "Experiências", match: null },
  { href: "/demo#aniversarios", label: "Aniversários", match: null },
  { href: "/demo#local", label: "Localização", match: null },
];

export function PublicHeader({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = open || scrolled || !transparent;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-black transition-[border-color] duration-300",
        solid ? "border-white/10" : "border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:gap-6 md:py-4">
        <Link
          href="/demo"
          className="relative h-10 w-[7.5rem] shrink-0 sm:h-12 sm:w-40"
          onClick={() => setOpen(false)}
        >
          <Image
            src={perolaAssets.logo}
            alt="Pérola Gastrobar"
            fill
            sizes="160px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-1 lg:gap-2 md:flex"
          aria-label="Principal"
        >
          {links.map((l) => {
            const active = l.match != null && pathname.startsWith(l.match);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "group relative inline-flex min-h-10 items-center px-3 text-[13px] font-medium tracking-wide transition-colors duration-200",
                  active ? "text-[#E8D48A]" : "text-white/70 hover:text-white",
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-[#C9A962] transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
          <PublicPrimaryLink
            href={`/demo/reservar/${EVENT_SLUG}`}
            className="ml-3 min-h-11 px-5 text-[13px]"
          >
            Reservar
          </PublicPrimaryLink>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <PublicPrimaryLink
            href={`/demo/reservar/${EVENT_SLUG}`}
            className="min-h-10 px-3.5 text-xs"
          >
            Reservar
          </PublicPrimaryLink>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] text-white transition-colors active:bg-white/15 hover:border-white/40 hover:bg-white/10"
            aria-expanded={open}
            aria-controls="public-mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-black md:hidden"
          id="public-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p id={titleId} className="text-sm font-semibold text-white/80">
              Menu
            </p>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex min-h-14 items-center rounded-xl px-3 text-base font-medium text-white/90 transition-colors active:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <PublicPrimaryLink
              href={`/demo/reservar/${EVENT_SLUG}`}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Reservar agora
            </PublicPrimaryLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
