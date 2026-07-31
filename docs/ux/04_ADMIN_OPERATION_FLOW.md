# UX 04 — Fluxos Operacionais Administrativos

**Produto:** Gestor Camarote  
**Foco:** Visão de hoje + Reservas (fila → decisão)  
**Telas:** ADM-01, ADM-02, ADM-03, ADM-04  

---

## 1. Visão de hoje (ADM-01)

### 1.1 Hierarquia de informação

1. **Contexto** — evento ativo/próximo + seletor  
2. **Ações urgentes** — pendências, aguardando sinal, alertas  
3. **Operação** — confirmadas, pessoas, chegadas, prep, disponíveis  
4. **Secundário** — aniversários, no-shows  

Sem gráficos decorativos.

### 1.2 Wireframe desktop

```
┌─ Hoje ─────────────────────────────────────────────┐
│ Evento: Sexta Live — Banda Norte ▼   Sex 08/08     │
│ [Abrir mapa] [Preparação] [Copiar link público]    │
│ Atualizado há 8s · ● ao vivo                       │
├───────────────┬───────────────┬────────────────────┤
│ Pendências  3 │ Aguard. sinal │ Alertas            │
│ [Ver fila →]  │      1        │ TTL em 2 solics.   │
│               │ [Ver →]       │                    │
├───────────────┼───────────────┼────────────────────┤
│ Confirmadas 12│ Pessoas  64   │ Disponíveis  5     │
│ Camarotes 6   │ Mesas 4       │ [Mapa →]           │
├───────────────┼───────────────┼────────────────────┤
│ Prep. pend. 7 │ Chegaram  9   │ No-shows  1        │
│ [Prep →]      │               │                    │
├───────────────┴───────────────┴────────────────────┤
│ Aniversários hoje (2)                              │
│ · Mari — Camarote 07 — Pacote Neon                 │
└────────────────────────────────────────────────────┘
```

### 1.3 Wireframe mobile

```
┌─────────────────────┐
│ Hoje · Sexta Live ▼ │
│ ● Atualizado 8s     │
│ [Mapa] [Prep]       │
├─────────────────────┤
│ ⚠ 3 pendências      │
│ [ Abrir fila ]      │
├─────────────────────┤
│ Sinal 1 · Prep 7    │
│ Conf. 12 · Pessoas 64│
│ Livres 5 · Chegaram 9│
├─────────────────────┤
│ Aniversários (2)    │
│ …                   │
└─────────────────────┘
│ Hoje Reservas Mapa… │  bottom nav
```

### 1.4 Sem evento hoje

```
Não há evento hoje.
Próximo: “Sábado Autoral” · 09/08
[ Ver próximos ] [ Criar evento ]
```

### 1.5 Troca de evento / atualização

- Seletor lista eventos do dia + “em andamento” + próximo.  
- Polling/SSE: badge “Atualizado há Xs”; se falha → “Dados podem estar desatualizados” + [Atualizar].  
- Ação local (ex. confirmar em outra aba): na volta, refresh.

### 1.6 Ações rápidas

| Card | Tap |
|------|-----|
| Pendências | ADM-02 filtro `solicitada` |
| Sinal | filtro `aguardando_sinal` |
| Prep | ADM-06/07 |
| Disponíveis / Confirmadas | Mapa |
| Aniversário row | Detalhe reserva |

---

## 2. Fila de reservas (ADM-02)

```
┌─ Reservas ─────────────────────────────────────────┐
│ [Buscar nome, telefone, espaço…]                   │
│ Status: [Pendentes▼] Tipo: [Todos▼] Evento: [Hoje▼]│
│ [ + Nova reserva ]                                 │
├────────────────────────────────────────────────────┤
│ ● Nova · há 2 min                                  │
│ Mariana Alves · Camarote 07 · 5 pess. · Aniversário│
│ Itens: 2 · Status: Solicitada        [Abrir]       │
├────────────────────────────────────────────────────┤
│ …                                                  │
└────────────────────────────────────────────────────┘
```

Ordenação default: mais antigas pendentes primeiro (FIFO operacional).

---

## 3. Detalhe da reserva (ADM-03)

```
┌─ Reserva #A1B2 ─────────────── [Solicitada] ───────┐
│ Evento: Sexta Live                                 │
│ Origem: Pública                                    │
│                                                    │
│ ESPAÇO          Camarote 07          [Trocar]      │
│ RESPONSÁVEL     Mariana Alves                      │
│ TELEFONE        (11) *****-0007  [Mostrar]         │
│ CPF             ***.***.***-07   [Mostrar]         │
│ PESSOAS         5                                  │
│ CHEGADA PREV.   23:30                              │
│                                                    │
│ CONVIDADOS      Mari, João, …                      │
│                                                    │
│ ADICIONAIS (snapshot)                              │
│  2× Balde Heineken — R$ 99                         │
│  1× Pacote Neon — R$ 350                           │
│                                                    │
│ OBS INTERNAS    [________________] [Salvar]        │
│                 (nunca visível ao cliente)         │
│                                                    │
│ PREPARAÇÃO      3 itens pendentes   [Abrir prep]   │
│                                                    │
│ HISTÓRICO                                          │
│  18:02 Solicitada (cliente)                        │
│                                                    │
│ AÇÕES                                              │
│ [ Confirmar ] [ Recusar ] [ Pedir info ]           │
│ [ Pedir sinal ] [ Lista espera ] [ Cancelar ]      │
└────────────────────────────────────────────────────┘
```

Após confirmada, ações mudam para: Chegada | No-show | Cancelar | Finalizar.

---

## 4. Ações e diálogos (ADM-04)

Toda ação crítica: modal com **consequências**.

### Confirmar

```
Confirmar reserva de Mariana no Camarote 07?

• Espaço ficará confirmado
• Cliente verá status “confirmada”
• Itens entrarão na preparação

[ Cancelar ]  [ Confirmar reserva ]
```

### Recusar

```
Recusar esta solicitação?

• Camarote 07 voltará a ficar disponível
• Cliente verá que não foi possível confirmar

Motivo (opcional, interno): [____]

[ Voltar ]  [ Recusar ]
```

### Pedir sinal

```
Marcar como aguardando sinal?

• Espaço permanece pré-reservado (até TTL)
• Cliente verá instruções informadas abaixo

Instruções ao cliente: [ Pix … ]  ← hipótese processo casa
Valor do sinal: [ R$ __ ]

[ Voltar ]  [ Enviar status ]
```

### Propor / trocar espaço

```
Trocar para: [ Camarote 04 ▼ ] (só disponíveis)

• Camarote 07 será liberado
• Camarote 04 ficará vinculado a esta reserva

[ Voltar ]  [ Confirmar troca ]
```

Falha se destino ocupado → toast conflito.

### Cancelar

```
Cancelar esta reserva?

Cancelar liberará o camarote 07 e cancelará
itens de preparação ainda pendentes.

[ Voltar ]  [ Cancelar reserva ]
```

### No-show

```
Registrar no-show?

• Espaço voltará a ficar disponível
• Preparação pendente será cancelada

[ Voltar ]  [ Registrar no-show ]
```

### Chegada

Sem modal longo se já confirmada — confirmação leve ou 1 toque no mapa:

```
Registrar chegada de Mariana?
[ Cancelar ] [ Chegou ]
```

---

## 5. Fluxo de análise (resumo)

```
Fila → Abrir → Ler risco (espaço, pessoas, itens, sinal)
  → Confirmar | Recusar | Info | Sinal | Espera | Trocar
  → Histórico atualiza
  → Mapa e Hoje refletem (≤15s ou refresh)
```

Reserva criada pela admin (`origin=admin`): formulário enxuto; pode ir direto a confirmada com modal de consequências.

---

## 6. Alteração de dados

Admin pode editar: partySize (dentro do max), telefone, nomes, itens (com recálculo prep se confirmada), obs internas.  
Mudanças sensíveis → audit.  
Cliente não vê obs internas.

---

## 7. Rastreabilidade

- FR-ADMIN-001..003; FR-RESERVATION-003..017  
- BR-RES-*; BR-TODAY-*; DEC-NOTES, DEC-UX-001  
- AC-TODAY-001; AC-RES-002..007; AC-PRIV-001  
- Risco: R-O-01 treino porta; R-P-01 abandono WhatsApp  
