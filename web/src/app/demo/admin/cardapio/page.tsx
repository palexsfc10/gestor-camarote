"use client";

import { useState } from "react";
import { useDemo } from "@/lib/store/demo-store";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { EVENT_ID } from "@/lib/mock/seed";

export default function CardapioPage() {
  const { catalog, updateCatalogItem, addCatalogItem, setToast } = useDemo();
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [description, setDescription] = useState("");

  const startNew = () => {
    setEditing("new");
    setName("");
    setPrice("99.90");
    setDescription("");
  };

  const save = () => {
    if (editing === "new") {
      addCatalogItem({
        id: `cat-${Date.now()}`,
        name,
        description,
        price: Number(price) || 0,
        category: "Outros",
        active: true,
        soldOut: false,
        highlight: false,
        allowInReservation: true,
        eventIds: [EVENT_ID],
      });
      setToast("Item cadastrado. Reflete no público nesta sessão.");
    } else if (editing) {
      updateCatalogItem(editing, {
        name,
        description,
        price: Number(price) || 0,
      });
      setToast("Item atualizado localmente.");
    }
    setEditing(null);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Cardápio e combos</h1>
        <Button size="sm" onClick={startNew}>
          Novo
        </Button>
      </div>
      <p className="mt-1 text-sm text-[var(--fg-muted)]">
        Sem estoque. Alterações refletem na experiência pública do protótipo.
      </p>

      <ul className="mt-4 space-y-3">
        {catalog.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--muted)]">{item.category}</p>
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-sm text-[var(--fg-muted)]">{item.description}</p>
                <p className="mt-1 text-[var(--accent)] font-semibold">
                  {formatBRL(item.price)}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.highlight ? <Badge tone="accent">Destaque</Badge> : null}
                {item.soldOut ? <Badge tone="danger">Esgotado</Badge> : null}
                {!item.active ? <Badge tone="neutral">Inativo</Badge> : null}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditing(item.id);
                  setName(item.name);
                  setPrice(String(item.price));
                  setDescription(item.description);
                }}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCatalogItem(item.id, { active: !item.active })
                }
              >
                {item.active ? "Desativar" : "Ativar"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCatalogItem(item.id, { soldOut: !item.soldOut })
                }
              >
                {item.soldOut ? "Disponível" : "Esgotado"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCatalogItem(item.id, { highlight: !item.highlight })
                }
              >
                Destaque
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updateCatalogItem(item.id, {
                    allowInReservation: !item.allowInReservation,
                  })
                }
              >
                {item.allowInReservation ? "Bloquear reserva" : "Permitir reserva"}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
            <h2 className="font-display text-xl">
              {editing === "new" ? "Novo item" : "Editar item"}
            </h2>
            <div>
              <Label htmlFor="n">Nome</Label>
              <Input id="n" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="d">Descrição</Label>
              <Textarea
                id="d"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="p">Preço</Label>
              <Input
                id="p"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button onClick={save}>Salvar</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
