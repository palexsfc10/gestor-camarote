"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { EVENT_ID } from "@/lib/mock/seed";

const steps = ["Informações", "Espaços", "Catálogo", "Revisão", "Publicação"];

export default function NovoEventoPage() {
  const { addEvent, spaces, catalog, setToast } = useDemo();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("Noite Pérola");
  const [dateLabel, setDateLabel] = useState("Sábado, 22 de agosto");
  const [timeLabel, setTimeLabel] = useState("Abertura às 20h");
  const [attraction, setAttraction] = useState("DJ convidado");
  const [rules, setRules] = useState("Reservas sujeitas à confirmação da casa.");
  const [description, setDescription] = useState("Novo evento do protótipo.");
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>(
    spaces.map((s) => s.id),
  );
  const [selectedItems, setSelectedItems] = useState<string[]>(
    catalog.map((c) => c.id),
  );

  const publish = (asDraft: boolean) => {
    const id = `evt-${Date.now()}`;
    addEvent({
      id,
      slug: title.toLowerCase().replace(/\s+/g, "-").slice(0, 40),
      title,
      dateLabel,
      timeLabel,
      attraction,
      rules,
      description,
      imageGradient: "from-[#2A1F3D] via-[#1B1724] to-[#0E0C12]",
      status: asDraft ? "rascunho" : "publicado",
    });
    setToast(
      asDraft
        ? "Evento salvo como rascunho."
        : "Evento publicado no site (simulado).",
    );
    router.push("/demo/admin/eventos");
  };

  return (
    <div className="px-4 py-6 max-w-xl">
      <h1 className="font-display text-3xl">Novo evento</h1>
      <p className="mt-2 text-sm text-[var(--fg-muted)]">
        Etapa {step + 1} de {steps.length} · {steps[step]}
      </p>
      <div className="mt-2 h-2 rounded-full bg-[var(--surface-2)]">
        <div
          className="h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {step === 0 && (
          <>
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="date">Data</Label>
              <Input id="date" value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="time">Horário</Label>
              <Input id="time" value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="attr">Atração</Label>
              <Input id="attr" value={attraction} onChange={(e) => setAttraction(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="rules">Regras</Label>
              <Textarea id="rules" value={rules} onChange={(e) => setRules(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="desc">Descrição</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </>
        )}
        {step === 1 && (
          <ul className="space-y-2">
            {spaces.map((s) => (
              <li key={s.id}>
                <label className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--border)] px-3">
                  <input
                    type="checkbox"
                    checked={selectedSpaces.includes(s.id)}
                    onChange={(e) =>
                      setSelectedSpaces((prev) =>
                        e.target.checked
                          ? [...prev, s.id]
                          : prev.filter((id) => id !== s.id),
                      )
                    }
                  />
                  {s.name}
                </label>
              </li>
            ))}
          </ul>
        )}
        {step === 2 && (
          <ul className="space-y-2">
            {catalog.map((c) => (
              <li key={c.id}>
                <label className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--border)] px-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(c.id)}
                    onChange={(e) =>
                      setSelectedItems((prev) =>
                        e.target.checked
                          ? [...prev, c.id]
                          : prev.filter((id) => id !== c.id),
                      )
                    }
                  />
                  {c.name}
                </label>
              </li>
            ))}
            <p className="text-xs text-[var(--muted)]">
              Associação ao evento {EVENT_ID} é visual no protótipo.
            </p>
          </ul>
        )}
        {step === 3 && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2 text-sm">
            <p>
              <strong>{title}</strong>
            </p>
            <p>
              {dateLabel} · {timeLabel}
            </p>
            <p>{attraction}</p>
            <p>{selectedSpaces.length} espaços · {selectedItems.length} itens</p>
            <p className="text-[var(--fg-muted)]">{rules}</p>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--fg-muted)]">
              Fluxo: rascunho → revisão → publicar. Sem page builder.
            </p>
            <Button className="w-full" onClick={() => publish(false)}>
              Publicar evento
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => publish(true)}
            >
              Salvar rascunho
            </Button>
          </div>
        )}
      </div>

      {step < 4 ? (
        <div className="mt-6 flex gap-2">
          {step > 0 ? (
            <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Voltar
            </Button>
          ) : null}
          <Button className="flex-1" onClick={() => setStep((s) => s + 1)}>
            Continuar
          </Button>
        </div>
      ) : null}
    </div>
  );
}
