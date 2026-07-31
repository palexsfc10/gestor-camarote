"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export default function SiteAdminPage() {
  const { site, updateSite, setToast } = useDemo();
  const [form, setForm] = useState(site);

  const save = () => {
    updateSite(form);
    setToast("Salvo e publicado (simulado). A home pública usa estes dados.");
  };

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-3xl">Site</h1>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Personalização leve · sem page builder
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          {(
            [
              ["name", "Nome"],
              ["tagline", "Slogan"],
              ["address", "Endereço"],
              ["phone", "Telefone"],
              ["whatsapp", "WhatsApp"],
              ["instagram", "Instagram"],
              ["hours", "Horários"],
              ["accentColor", "Cor de destaque"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <Button type="submit" className="w-full">
            Salvar e publicar
          </Button>
        </form>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
            Pré-visualização
          </p>
          <h2 className="font-display mt-2 text-2xl">{form.name}</h2>
          <p className="text-[var(--fg-muted)]">{form.tagline}</p>
          <p className="mt-4 text-sm">{form.description}</p>
          <p className="mt-4 text-sm text-[var(--fg-muted)]">{form.address}</p>
          <p className="text-sm text-[var(--fg-muted)]">{form.hours}</p>
          <p className="mt-3 text-sm">
            {form.instagram} · {form.whatsapp}
          </p>
          <div
            className="mt-4 h-3 rounded-full"
            style={{ background: form.accentColor }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
