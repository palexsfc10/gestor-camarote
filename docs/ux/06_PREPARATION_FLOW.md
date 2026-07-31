# UX 06 — Fluxo de Preparação

**Produto:** Gestor Camarote  
**Telas:** ADM-06, ADM-07  
**Decisão aprovada:** visão por reserva **e** consolidada por item  
**Contexto de uso:** celular/tablet na operação  

---

## 1. Entrada

- Nav **Preparação**  
- Atalho Visão de hoje → “Prep. pendentes”  
- Detalhe da reserva → “Abrir prep”  

Seletor de evento obrigatório (default = evento de hoje).

Toggle persistente:

```
[ Por reserva ]  [ Por item ]
```

Filtros: `Pendentes | Em prep. | Prontos | Entregues | Cancelados | Todos`

---

## 2. Visão A — Por reserva (ADM-06)

### Objetivo
Montar o pedido de um espaço específico.

### Wireframe mobile

```
┌─ Preparação · Por reserva ───────────┐
│ Evento: Sexta Live ▼                 │
│ [Por reserva] [Por item]             │
│ Filtro: [Pendentes ▼]  [Buscar]      │
├──────────────────────────────────────┤
│ Camarote 07 · Mariana · 23:30        │
│ Solicitada→Confirmada                │
│                                      │
│ ○ 2× Balde Heineken                  │
│   [ Em prep. ]                       │
│ ○ 1× Pacote Neon (bolo+decor)        │
│   Obs: “vela número 30”              │
│   [ Em prep. ]                       │
│                                      │
│ [ Abrir reserva ]                    │
├──────────────────────────────────────┤
│ Mesa 12 · …                          │
└──────────────────────────────────────┘
```

### Desktop
Lista à esquerda (reservas com itens); detalhe/itens à direita.

### Campos por card de reserva
- Espaço  
- Responsável  
- Horário previsto  
- Itens (nome snapshot, qtd)  
- Observações do item / internas relevantes à prep (não expor ao cliente)  
- Status por item  

---

## 3. Visão B — Consolidada por item (ADM-07)

### Objetivo
Produzir em lote (“quantos baldes no total?”).

### Wireframe mobile

```
┌─ Preparação · Por item ──────────────┐
│ [Por reserva] [Por item]             │
├──────────────────────────────────────┤
│ Balde Heineken                       │
│ Total: 8  · Pendente: 5  · Pronto: 3 │
│                                      │
│ Relacionadas:                        │
│  · C07 Mariana — 2  [→]              │
│  · C03 Pedro — 3                     │
│  · M12 Ana — 3                       │
│                                      │
│ [ Marcar 1 em prep. ] (contexto)     │
└──────────────────────────────────────┘
```

Avanço de status preferencialmente **por linha de PreparationItem** (não “marcar 8 de uma vez” no MVP — evita erro). Atalho “marcar todos pendentes deste item como em prep.” = COULD com confirmação.

### Desktop
Tabela/cards densos mas legíveis: item | total | pendente | em prep | pronto | entregue.

---

## 4. Status e ações

| Status | Próxima ação primária | Estilo |
|--------|----------------------|--------|
| pendente | Em preparação | Outline |
| em_preparacao | Pronto | Primário |
| pronto | Entregue | Primário |
| entregue | — (readonly) | Sucesso |
| cancelado | — | Neutro riscado |

Confirmação só se reverter status (SHOULD) ou cancelar manualmente.

---

## 5. Regras de UX

1. Itens cancelados (reserva cancelada) somem da fila ativa ou aparecem só no filtro Cancelados.  
2. Nome/preço = snapshot; mudança de catálogo não altera card antigo.  
3. Sem estoque: “esgotado” não é gerido aqui.  
4. Polling: lista atualiza; se item mudou sob você → toast “Item atualizado”.  
5. Alvos de toque grandes; uma mão.  

---

## 6. Estados vazios

| Caso | Mensagem |
|------|----------|
| Sem itens no evento | “Nenhuma preparação para este evento. Itens aparecem após confirmar reservas.” |
| Filtro vazio | “Nada neste status.” |
| Sem evento | Igual Visão de hoje |

---

## 7. Rastreabilidade

- FR-PREPARATION-001..005; DEC-PREP-001; DEC-SNAP-001  
- BR-PREP-*; AC-PREP-001, 002  
- Persona P4  
- Risco: preparar item cancelado → mitigado por status cancelado visível  
