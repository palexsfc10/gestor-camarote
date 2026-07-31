"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  consequences,
  confirmLabel = "Confirmar",
  cancelLabel = "Voltar",
  tone = "default",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  consequences: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger" | "success";
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in" />
        <Dialog.Content
          className={cn(
            "fixed z-50 w-[calc(100%-0px)] max-w-md border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl focus:outline-none",
            "inset-x-0 bottom-0 rounded-t-3xl pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5",
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
          {description ? (
            <Dialog.Description className="mt-2 text-sm text-[var(--fg-muted)]">
              {description}
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">
              Confirmação de ação crítica
            </Dialog.Description>
          )}
          <ul className="mt-4 space-y-2 text-sm text-[var(--fg)]">
            {consequences.map((c) => (
              <li
                key={c}
                className="rounded-xl bg-[var(--surface-2)] px-3 py-2 border border-[var(--border)]"
              >
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button
              variant={
                tone === "danger"
                  ? "danger"
                  : tone === "success"
                    ? "success"
                    : "default"
              }
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
