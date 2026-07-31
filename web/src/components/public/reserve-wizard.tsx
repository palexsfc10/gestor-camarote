"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useDemo } from "@/lib/store/demo-store";
import type { ExperienceType, SpaceKind } from "@/lib/types";
import { formatBRL } from "@/lib/utils";
import { SpaceList } from "@/components/map/venue-map";
import { SpaceStatusBadge } from "@/components/status-badges";

const steps = [
  "Experiência",
  "Espaço",
  "Responsável",
  "Pessoas",
  "Adicionais",
  "Revisão",
] as const;

const experienceLabels: Record<ExperienceType, string> = {
  camarote: "Camarote",
  mesa: "Mesa",
  aniversario: "Aniversário",
};

function spaceKindForExperience(type: ExperienceType): SpaceKind {
  return type === "mesa" ? "mesa" : "camarote";
}

const responsibleSchema = z.object({
  responsibleName: z.string().min(3, "Informe o nome completo"),
  phone: z.string().min(10, "Informe um telefone válido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  expectedArrival: z.string().optional(),
  celebrationName: z.string().optional(),
  publicNotes: z.string().optional(),
});

type ResponsibleForm = z.infer<typeof responsibleSchema>;

export function ReserveWizard() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const {
    events,
    catalog,
    spaces,
    submitPublicReservation,
    setActiveEventId,
    activeEventId,
  } = useDemo();
  const event = events.find((e) => e.slug === params.slug);

  useEffect(() => {
    if (event && event.id !== activeEventId) {
      setActiveEventId(event.id);
    }
  }, [event, activeEventId, setActiveEventId]);

  const initialType = (search.get("tipo") as ExperienceType | null) ?? "aniversario";
  const [step, setStep] = useState(0);
  const [type, setType] = useState<ExperienceType>(
    ["camarote", "mesa", "aniversario"].includes(initialType)
      ? initialType
      : "aniversario",
  );
  const [spaceId, setSpaceId] = useState(() => {
    const fromQuery = search.get("space");
    if (fromQuery) return fromQuery;
    return spaceKindForExperience(
      ["camarote", "mesa", "aniversario"].includes(initialType)
        ? initialType
        : "aniversario",
    ) === "mesa"
      ? "mesa-02"
      : "sp-07";
  });
  const [partySize, setPartySize] = useState(5);
  const [guestNames, setGuestNames] = useState<string[]>([
    "Mari",
    "João",
    "Ana",
    "Pedro",
    "Lia",
  ]);
  const [qty, setQty] = useState<Record<string, number>>({
    "cat-neon": 1,
    "cat-niver": 1,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ResponsibleForm>({
    resolver: zodResolver(responsibleSchema),
    defaultValues: {
      responsibleName: "Mariana Alves",
      phone: "(11) 98888-0007",
      email: "mariana@email.com",
      expectedArrival: "21:30",
      celebrationName: "Mari",
      publicNotes: "Aniversário — veio do Instagram",
    },
  });

  const spaceKind = spaceKindForExperience(type);
  const selectedSpace = spaces.find((s) => s.id === spaceId);

  const pickDefaultSpace = (nextType: ExperienceType) => {
    const kind = spaceKindForExperience(nextType);
    const preferred =
      kind === "mesa"
        ? spaces.find((s) => s.kind === "mesa" && s.status === "disponivel")
        : spaces.find((s) => s.id === "sp-07" && s.status === "disponivel") ??
          spaces.find((s) => s.kind === "camarote" && s.status === "disponivel");
    return preferred?.id ?? "";
  };
  const availableItems = catalog.filter(
    (c) => c.active && c.allowInReservation && !c.soldOut,
  );

  const selectedItems = useMemo(
    () =>
      availableItems
        .filter((c) => (qty[c.id] ?? 0) > 0)
        .map((c) => ({
          catalogItemId: c.id,
          nameSnapshot: c.name,
          unitPriceSnapshot: c.price,
          quantity: qty[c.id],
        })),
    [availableItems, qty],
  );

  const total =
    (selectedSpace?.price ?? 0) +
    selectedItems.reduce((acc, i) => acc + i.unitPriceSnapshot * i.quantity, 0);

  if (!event || event.status !== "publicado") {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <h1 className="font-display text-2xl">Reservas indisponíveis</h1>
        <p className="mt-2 text-[var(--fg-muted)]">
          Este evento não aceita novas solicitações no protótipo.
        </p>
      </div>
    );
  }

  const next = async () => {
    setError(null);
    if (step === 0) setStep(1);
    else if (step === 1) {
      if (!spaceId) {
        setError("Selecione um espaço disponível.");
        return;
      }
      const space = spaces.find((s) => s.id === spaceId);
      if (!space || space.status !== "disponivel") {
        setError("Esse espaço não está disponível. Escolha outro.");
        return;
      }
      if (space.kind !== spaceKindForExperience(type)) {
        setError("Selecione um espaço do tipo escolhido.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const ok = await form.trigger();
      if (!ok) return;
      setStep(3);
    } else if (step === 3) {
      if (partySize < 1 || partySize > 10) {
        setError("Quantidade deve ser entre 1 e 10.");
        return;
      }
      setStep(4);
    } else if (step === 4) setStep(5);
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const values = form.getValues();
      const reservation = submitPublicReservation({
        type,
        spaceId,
        eventId: event!.id,
        responsibleName: values.responsibleName,
        phone: values.phone,
        email: values.email || undefined,
        partySize,
        guestNames:
          type === "aniversario"
            ? guestNames.filter(Boolean).slice(0, partySize)
            : type === "camarote"
              ? guestNames.filter(Boolean)
              : [],
        expectedArrival: values.expectedArrival,
        celebrationName:
          type === "aniversario" ? values.celebrationName : undefined,
        publicNotes: values.publicNotes,
        items: selectedItems,
      });
      router.push(`/demo/reserva/${reservation.publicCode}`);
    } catch {
      setError("Esse espaço acabou de ficar indisponível. Escolha outro.");
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg overflow-x-hidden px-4 py-5 pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-white sm:py-6 md:pb-10">
      <div className="mb-4 flex gap-3 overflow-hidden rounded-2xl border border-white/10 bg-[#121014] p-2.5 sm:mb-5 sm:p-3">
        {event.posterImage ? (
          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-black sm:h-28 sm:w-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.posterImage}
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        ) : null}
        <div className="min-w-0 py-0.5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#C9A962] sm:text-[11px] sm:tracking-[0.2em]">
            {event.dateLabel} · {event.timeLabel}
          </p>
          <h1 className="font-display mt-1 text-xl leading-tight sm:text-2xl">
            Solicitar reserva
          </h1>
          <p className="mt-0.5 truncate text-sm text-white/70">{event.title}</p>
        </div>
      </div>
      <p
        className="rounded-xl border border-[#C9A962]/35 bg-[#C9A962]/10 px-3 py-2 text-[13px] leading-snug text-[#E8D48A] sm:text-sm"
        role="note"
      >
        Solicitação enviada não significa reserva confirmada. A casa analisa
        antes de confirmar.
      </p>

      <div className="mt-4" aria-label="Progresso">
        <p className="text-sm font-semibold">
          Etapa {step + 1}/{steps.length}
          <span className="text-white/50"> · {steps[step]}</span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10 sm:h-2">
          <div
            className="h-full bg-[#C9A962] transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {step === 0 && (
          <div className="grid gap-2">
            {(
              [
                ["camarote", "Camarote", "Espaço exclusivo"],
                ["mesa", "Mesa", "Quantidade basta"],
                ["aniversario", "Aniversário", "Com pacote e lista"],
              ] as const
            ).map(([value, title, desc]) => (
              <button
                key={value}
                type="button"
                data-testid={`experience-${value}`}
                onClick={() => {
                  setType(value);
                  setSpaceId(pickDefaultSpace(value));
                  setStep(1);
                }}
                className={`rounded-2xl border p-4 text-left min-h-[4.25rem] transition-colors active:scale-[0.99] ${
                  type === value
                    ? "border-[#C9A962] bg-[#C9A962]/10"
                    : "border-white/15 bg-[#121014]"
                }`}
              >
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-white/60">{desc}</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-3 text-sm text-white/60">
              {spaceKind === "mesa"
                ? "Selecione uma mesa disponível."
                : type === "aniversario"
                  ? "Selecione o Camarote 07 (livre no início da demonstração)."
                  : "Selecione um camarote disponível."}
            </p>
            <SpaceList
              kind={spaceKind}
              onlyAvailable
              selectedId={spaceId}
              onSelect={(s) => setSpaceId(s.id)}
            />
            {selectedSpace ? (
              <div className="mt-3 rounded-xl border border-white/15 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{selectedSpace.name}</span>
                  <SpaceStatusBadge status={selectedSpace.status} />
                </div>
                <p className="mt-1 text-white/60">
                  Até {selectedSpace.capacity} pessoas
                  {selectedSpace.price > 0
                    ? ` · ${formatBRL(selectedSpace.price)}`
                    : ""}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {step === 2 && (
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="responsibleName">Nome completo *</Label>
              <Input id="responsibleName" {...form.register("responsibleName")} />
              {form.formState.errors.responsibleName ? (
                <p className="mt-1 text-sm text-[#F0A8A8]" role="alert">
                  {form.formState.errors.responsibleName.message}
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="phone">WhatsApp / telefone *</Label>
              <Input id="phone" inputMode="tel" {...form.register("phone")} />
            </div>
            <div>
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            {type === "aniversario" ? (
              <div>
                <Label htmlFor="celebrationName">Nome exibido na casa</Label>
                <Input id="celebrationName" {...form.register("celebrationName")} />
              </div>
            ) : null}
            <div>
              <Label htmlFor="expectedArrival">Chegada prevista</Label>
              <Input id="expectedArrival" {...form.register("expectedArrival")} />
            </div>
            <div>
              <Label htmlFor="publicNotes">Observação para a casa</Label>
              <Textarea id="publicNotes" {...form.register("publicNotes")} />
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="partySize">Quantidade de pessoas *</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                >
                  −
                </Button>
                <Input
                  id="partySize"
                  className="text-center"
                  value={partySize}
                  onChange={(e) => setPartySize(Number(e.target.value) || 1)}
                  inputMode="numeric"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPartySize((n) => Math.min(10, n + 1))}
                >
                  +
                </Button>
              </div>
            </div>
            {(type === "aniversario" || type === "camarote") && (
              <div className="space-y-2">
                <Label>
                  {type === "aniversario"
                    ? "Lista nominal"
                    : "Nomes (opcional)"}
                </Label>
                {Array.from({ length: Math.min(partySize, 8) }).map((_, i) => (
                  <Input
                    key={i}
                    placeholder={`Convidado ${i + 1}`}
                    value={guestNames[i] ?? ""}
                    onChange={(e) => {
                      const nextNames = [...guestNames];
                      nextNames[i] = e.target.value;
                      setGuestNames(nextNames);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <ul className="space-y-2">
            {availableItems.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-white/15 bg-[#121014] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-white/60">{item.description}</p>
                    <p className="mt-1 text-[#C9A962] font-semibold">
                      {formatBRL(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setQty((q) => ({
                          ...q,
                          [item.id]: Math.max(0, (q[item.id] ?? 0) - 1),
                        }))
                      }
                    >
                      −
                    </Button>
                    <span className="w-6 text-center font-semibold">
                      {qty[item.id] ?? 0}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        setQty((q) => ({
                          ...q,
                          [item.id]: (q[item.id] ?? 0) + 1,
                        }))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {step === 5 && (
          <div
            className="space-y-3 rounded-2xl border border-white/15 bg-[#121014] p-4"
            data-testid="wizard-review"
          >
            <p data-testid="review-experience">
              Experiência: {experienceLabels[type]}
            </p>
            <p data-testid="review-space">Espaço: {selectedSpace?.name}</p>
            <p>
              Responsável: {form.getValues("responsibleName")} ·{" "}
              {form.getValues("phone")}
            </p>
            <p>Pessoas: {partySize}</p>
            <ul className="text-sm text-white/60">
              {selectedItems.map((i) => (
                <li key={i.catalogItemId}>
                  {i.quantity}× {i.nameSnapshot}
                </li>
              ))}
            </ul>
            <p className="font-display text-xl text-[#C9A962]">
              Total estimado {formatBRL(total)}
            </p>
            <p className="rounded-xl bg-white/5 p-3 text-sm">
              Isto é uma <strong>solicitação</strong>. A casa precisa aprovar
              antes da reserva ser confirmada.
            </p>
          </div>
        )}

        {error ? (
          <p className="text-sm text-[#F0A8A8]" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0A090C]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:mt-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <div className="mx-auto flex max-w-lg gap-2">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              className="min-h-12 flex-1"
              onClick={() => setStep((s) => s - 1)}
            >
              Voltar
            </Button>
          ) : null}
          {step < 5 ? (
            <Button
              type="button"
              className="min-h-12 flex-1 bg-[#C9A962] text-[#0A090C] hover:bg-[#E8D48A]"
              data-testid="wizard-next"
              onClick={() => void next()}
            >
              Continuar
            </Button>
          ) : (
            <Button
              type="button"
              className="min-h-12 flex-1 bg-[#C9A962] text-[#0A090C] hover:bg-[#E8D48A]"
              data-testid="wizard-submit"
              disabled={submitting}
              onClick={() => void submit()}
            >
              {submitting ? "Enviando…" : "Enviar solicitação"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
