"use client";

import { Suspense } from "react";
import { ReserveWizard } from "@/components/public/reserve-wizard";
import { PublicHeader } from "@/components/public/public-header";

export default function ReserveWizardPage() {
  return (
    <div className="bg-[#0A090C] min-h-screen text-white">
      <PublicHeader />
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg px-4 py-10 text-white/60">
            Carregando fluxo de reserva…
          </div>
        }
      >
        <ReserveWizard />
      </Suspense>
    </div>
  );
}
