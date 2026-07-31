"use client";

import { usePathname } from "next/navigation";
import { DemoProvider } from "@/lib/store/demo-store";
import { DemoBanner, ModeSwitcher, ToastHost } from "@/components/demo/chrome";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/demo/admin");

  return (
    <DemoProvider>
      <div className="min-h-screen flex flex-col bg-[#0A090C]">
        <DemoBanner />
        <div className="z-50 border-b border-white/5 bg-[#0A090C]/80 px-3 py-1.5 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <p className="text-[10px] text-white/40 truncate">
              Demo NTWS Labs · Cliente ↔ Painel
            </p>
            <ModeSwitcher />
          </div>
        </div>
        <main className={`flex-1 ${isAdmin ? "bg-[var(--bg)] text-[var(--fg)]" : ""}`}>
          {children}
        </main>
        <ToastHost />
      </div>
    </DemoProvider>
  );
}
