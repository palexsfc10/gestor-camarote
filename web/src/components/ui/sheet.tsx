"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

/** Bottom sheet no mobile; painel lateral/central no tablet+desktop. */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
  side = "bottom",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
  side?: "bottom" | "right";
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content
          className={cn(
            "fixed z-50 border border-[var(--border)] bg-[var(--surface)] shadow-xl focus:outline-none",
            side === "bottom" &&
              "inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5",
            side === "right" &&
              "inset-y-0 right-0 w-[min(100%,22rem)] overflow-y-auto rounded-l-3xl p-5",
          )}
        >
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20 sm:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="font-display text-xl text-[var(--fg)]">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Fechar">
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{title}</Dialog.Description>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
