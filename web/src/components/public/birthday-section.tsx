"use client";

import { useEffect, useRef, useState } from "react";
import {
  birthdayPackages,
  perolaAssets,
} from "@/lib/perola/public-content";
import { EVENT_SLUG } from "@/lib/mock/seed";
import { PublicPrimaryLink } from "@/components/public/public-cta";
import { FlyerFrame } from "@/components/public/flyer-frame";
import { cn } from "@/lib/utils";

export function BirthdaySection({
  onInViewChange,
}: {
  onInViewChange?: (inView: boolean) => void;
}) {
  const [selectedId, setSelectedId] = useState(birthdayPackages[1]?.id ?? "b15");
  const sectionRef = useRef<HTMLElement>(null);
  const selected =
    birthdayPackages.find((p) => p.id === selectedId) ?? birthdayPackages[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !onInViewChange) return;
    const io = new IntersectionObserver(
      ([entry]) => onInViewChange(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0.2, 0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onInViewChange]);

  return (
    <section
      id="aniversarios"
      ref={sectionRef}
      className="scroll-mt-28"
      aria-labelledby="aniversario-title"
    >
      <div className="grid gap-6 md:grid-cols-12 md:items-start md:gap-8 lg:gap-10">
        {/* Desktop flyer — coluna esquerda */}
        <div className="hidden md:col-span-5 md:block">
          <FlyerFrame
            src={perolaAssets.birthday}
            alt="Arte Aniversário com estilo — pacotes Pérola"
            sizes="(max-width:1024px) 45vw, 40vw"
            frameClassName="h-[min(70vh,36rem)] w-full"
          />
        </div>

        <div className="md:col-span-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A962]">
            Celebração
          </p>
          <h2
            id="aniversario-title"
            className="font-display mt-2 text-[1.75rem] leading-tight sm:text-3xl md:text-4xl"
          >
            Aniversário com estilo
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-base">
            Venha comemorar no Pérola. Pacotes com bolo, convite digital e
            entradas VIP — conforme arte oficial da casa.
          </p>

          {/* Mobile flyer — após resumo */}
          <div className="mt-5 md:hidden">
            <FlyerFrame
              src={perolaAssets.birthday}
              alt="Arte Aniversário com estilo — pacotes Pérola"
              sizes="100vw"
              frameClassName="h-[min(48vh,22rem)] w-full"
            />
          </div>

          {/* Mobile: seletor de pacote · Tablet+: grade 2x2 */}
          <div className="mt-6 md:hidden">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Escolha o pacote
            </p>
            <div
              className="mt-3 grid grid-cols-4 gap-2"
              role="tablist"
              aria-label="Pacotes de aniversário"
            >
              {birthdayPackages.map((pkg) => {
                const active = pkg.id === selectedId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedId(pkg.id)}
                    className={cn(
                      "min-h-14 rounded-xl border px-1 py-2 text-center transition-colors active:scale-[0.98]",
                      active
                        ? "border-[#C9A962] bg-[#C9A962]/15 text-[#E8D48A]"
                        : "border-white/15 bg-white/[0.03] text-white/75",
                    )}
                  >
                    <span className="block text-lg font-bold leading-none">
                      {pkg.guests}
                    </span>
                    <span className="mt-1 block text-[10px] uppercase tracking-wider opacity-70">
                      conv.
                    </span>
                  </button>
                );
              })}
            </div>
            {selected ? (
              <div
                className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                role="tabpanel"
              >
                <p className="font-semibold text-[#E8D48A]">
                  {selected.guests} convidados
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {selected.includes}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-white/50">
                  {selected.vip}
                </p>
              </div>
            ) : null}
          </div>

          <ul className="mt-6 hidden gap-3 sm:grid-cols-2 md:grid">
            {birthdayPackages.map((pkg) => (
              <li
                key={pkg.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-semibold text-[#E8D48A]">
                  {pkg.guests} convidados
                </p>
                <p className="mt-1 text-sm text-white/70">{pkg.includes}</p>
                <p className="mt-2 text-xs uppercase tracking-wider text-white/50">
                  {pkg.vip}
                </p>
              </li>
            ))}
          </ul>

          <PublicPrimaryLink
            href={`/demo/reservar/${EVENT_SLUG}?tipo=aniversario`}
            className="mt-6 w-full sm:w-auto"
            data-testid="birthday-cta"
          >
            Quero comemorar meu aniversário
          </PublicPrimaryLink>

          <p className="mt-4 text-xs leading-relaxed text-white/40">
            Detalhes VIP e validade comercial a confirmar com a casa. Solicitação
            não é confirmação automática.
          </p>
        </div>
      </div>
    </section>
  );
}
