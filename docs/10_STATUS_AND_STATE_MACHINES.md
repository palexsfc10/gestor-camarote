# 10 — Status e Máquinas de Estado

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

---

## 1. Análise: o que é necessário no MVP?

Lista inicial proposta vs. recomendação:

### 1.1 Reserva — avaliação

| Status proposto | MVP? | Decisão |
|-----------------|------|---------|
| solicitada | SIM | Entrada pública |
| em análise | REDUNDANTE | Tratar como fila visual de `solicitada` (label UI, não estado persistido obrigatório) |
| aguardando informações | SIM (SHOULD→MUST se usado) | Manter |
| aguardando sinal | SIM SHOULD | Manter |
| confirmada | SIM | |
| cliente chegou | SIM | |
| em atendimento | OPCIONAL | Fundir com “chegou” no MVP se confundir |
| finalizada | SIM | Terminal OK |
| cancelada pelo cliente | SIM | |
| cancelada pela casa | SIM | |
| recusada | SIM | |
| no-show | SIM | |
| lista de espera | SHOULD | |
| expirada | SIM | |

### 1.2 Espaço — avaliação

| Status proposto | MVP? | Decisão |
|-----------------|------|---------|
| disponível | SIM | |
| pré-reservado | SIM | Ligado a solicitação ativa |
| aguardando confirmação | REDUNDANTE | = pré-reservado |
| confirmado | SIM | |
| ocupado | SIM | Chegada |
| bloqueado | SHOULD | |
| manutenção | COULD | Pode ser subtipo de bloqueado |
| indisponível | SIM | Fora do evento / inativo |

---

## 2. Máquina de estados — Reservation (MVP)

### 2.1 Estados persistidos recomendados

`solicitada` → `aguardando_informacoes` → `aguardando_sinal` → `lista_espera` → `confirmada` → `cliente_chegou` → (`em_atendimento`) → `finalizada`

Terminais negativos: `recusada`, `cancelada_cliente`, `cancelada_casa`, `no_show`, `expirada`

### 2.2 Quem pode alterar

| Transição | Ator |
|-----------|------|
| → solicitada | Público / Sistema (create); Admin (create interna) |
| solicitada → confirmada | Admin reservas / gestor |
| solicitada → recusada | Admin |
| solicitada → aguardando_* | Admin |
| solicitada → lista_espera | Admin |
| solicitada → expirada | Sistema (TTL) |
| aguardando_* → confirmada / recusada / cancelada_casa / expirada | Admin / Sistema |
| confirmada → cliente_chegou | Recepção / Admin |
| confirmada → no_show | Recepção / Admin |
| confirmada → cancelada_* | Cliente (política) / Admin |
| cliente_chegou → finalizada | Recepção / Admin |
| cliente_chegou → em_atendimento → finalizada | Opcional |
| * → cancelada_cliente | Cliente se política permitir e status ∈ {solicitada, aguardando_*, confirmada?} |

### 2.3 Diagrama de transições permitidas (MVP)

```
[solicitada]
   ├─ confirmada
   ├─ recusada
   ├─ aguardando_informacoes
   ├─ aguardando_sinal
   ├─ lista_espera
   ├─ cancelada_casa
   ├─ cancelada_cliente
   └─ expirada

[aguardando_informacoes]
   ├─ solicitada (info recebida / reabrir análise)
   ├─ confirmada
   ├─ recusada
   ├─ aguardando_sinal
   ├─ cancelada_*
   └─ expirada

[aguardando_sinal]
   ├─ confirmada
   ├─ recusada
   ├─ cancelada_*
   └─ expirada

[lista_espera]
   ├─ solicitada / confirmada (quando houver espaço)
   ├─ cancelada_*
   └─ expirada

[confirmada]
   ├─ cliente_chegou
   ├─ no_show
   ├─ cancelada_casa
   └─ cancelada_cliente (se política)

[cliente_chegou]
   ├─ em_atendimento (opt)
   └─ finalizada

[em_atendimento] → finalizada

Terminais: finalizada, recusada, cancelada_*, no_show, expirada
```

### 2.4 Efeitos por transição

| Transição | Efeito espaço | Efeito preparação | Efeito cliente |
|-----------|---------------|-------------------|----------------|
| create solicitada | → pré-reservado (se houver espaço) | — | “enviada” |
| confirmada | → confirmado | gera/ativa itens | “confirmada” |
| recusada / cancelada / expirada | → disponível (se ocupava) | cancela pendentes | status correspondente |
| lista_espera | libera espaço por padrão | — | espera |
| cliente_chegou | → ocupado | — | — |
| no_show | → disponível (default) | cancela não entregues | — |
| finalizada | permanece histórico; espaço livre no pós-evento | encerra | — |

### 2.5 Expiração de pré-reserva

| Campo | Proposta |
|-------|----------|
| O que expira | `solicitada`, `aguardando_informacoes`, `aguardando_sinal` sem ação |
| TTL default | configurável; **proposta 12h** (validar OQ) |
| Efeito | `expirada` + libera EventSpace |
| Confirmed | **não** expira por esse TTL |

---

## 3. Máquina de estados — EventSpace / espaço no evento

### 3.1 Estados

`disponivel` | `pre_reservado` | `confirmado` | `ocupado` | `bloqueado` | `indisponivel`  
(`manutencao` = bloqueado com motivo manutenção)

### 3.2 Derivação

O status do espaço é **derivado** da reserva ocupante ativa + bloqueios, não editado solto (exceto bloqueio).

| Condição | Status |
|----------|--------|
| Sem reserva ocupante e não bloqueado e disponível no evento | disponivel |
| Reserva em solicitada/aguardando_* | pre_reservado |
| Reserva confirmada | confirmado |
| Reserva cliente_chegou / em_atendimento | ocupado |
| Bloqueio/manutenção | bloqueado |
| Não ofertado no evento / inativo | indisponivel |

### 3.3 Quando volta a disponível

- Recusa, cancelamento, expiração, no-show (default), remoção de bloqueio.  
- Fim do evento: espaços voltam ao pool do venue (sem ocupação de evento encerrado).

---

## 4. Máquina — Preparação

`pendente` → `em_preparacao` → `pronto` → `entregue`  
qualquer não terminal → `cancelado`

| Ator | Pode |
|------|------|
| Preparação / Admin | avançar status |
| Sistema | cancelar se reserva cancelada |

---

## 5. Máquina — Event

`draft` → `published` ⇄ `unpublished` → `archived`  
`published` → `cancelled`  
`draft` → `cancelled` (raro)

Recorrência: WON’T NOW.

---

## 6. Como evitar conflitos (resumo normativo)

1. Constraint única de reserva ocupante por EventSpace.  
2. Transações na confirmação e na criação com verificação.  
3. Lista de espera **não** segura espaço (default).  
4. Troca de espaço: lock nos dois EventSpaces.  
5. UI nunca é autoridade.

---

## 7. Linguagem para o cliente (mapa de UX)

| Status interno | Texto sugerido |
|----------------|----------------|
| solicitada | Solicitação recebida — aguardando a casa |
| aguardando_informacoes | Precisamos de mais informações |
| aguardando_sinal | Aguardando sinal / instruções |
| lista_espera | Você está na lista de espera |
| confirmada | Reserva confirmada pela casa |
| cliente_chegou | Check-in realizado |
| finalizada | Encerrada |
| recusada | Não foi possível confirmar |
| cancelada_* | Cancelada |
| no_show | Não comparecimento registrado |
| expirada | Solicitação expirada |

Nunca usar “confirmada” para `solicitada`.
