"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/components/concepts/use-reduced-motion";

const SEGMENT =
  "PÉROLA GASTROBAR ✦ PROGRAMAÇÃO DA SEMANA ✦ RESERVAS ABERTAS ✦ CAMAROTES, MESAS E ANIVERSÁRIOS ✦ OSASCO • KM18 ✦ SOLICITAÇÃO SUJEITA À CONFIRMAÇÃO DA CASA ✦ ";

export function PublicMarquee() {
  const reduced = usePrefersReducedMotion();
  const line = `${SEGMENT}${SEGMENT}`;

  return (
    <div
      className="relative z-40 overflow-hidden border-b border-white/10 bg-black"
      aria-label="Informações da casa"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent sm:w-16" />

      {reduced ? (
        <p className="truncate px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A962]/85 sm:text-[11px]">
          Pérola Gastrobar • Programação da semana • Reservas abertas • Osasco •
          KM18
        </p>
      ) : (
        <motion.div
          className="flex whitespace-nowrap py-2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        >
          <p className="px-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A962]/85 sm:text-[11px]">
            {line}
          </p>
          <p
            className="px-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A962]/85 sm:text-[11px]"
            aria-hidden
          >
            {line}
          </p>
        </motion.div>
      )}
    </div>
  );
}
