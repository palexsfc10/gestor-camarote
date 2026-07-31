# UX 03 — Fluxo Público de Solicitação de Reserva

**Produto:** Gestor Camarote  
**Telas:** PUB-03 → PUB-04…PUB-10  
**Princípio:** “Solicitação enviada” ≠ “Reserva confirmada”  

---

## 1. Jornada completa

```
Instagram / WhatsApp
    → PUB-03 Página do evento
    → PUB-04 Experiência
    → PUB-05 Espaço
    → PUB-06 Dados do responsável
    → PUB-07 Convidados
    → PUB-08 Adicionais
    → PUB-09 Revisão + envio
    → PUB-10 Acompanhamento
```

Progresso visual fixo no topo do wizard: `1 Experiência · 2 Espaço · 3 Dados · 4 Convidados · 5 Adicionais · 6 Revisão`

Rodapé persistente do wizard (todas as etapas):

> Sua solicitação só será confirmada após análise da casa.

---

## 2. Wireframes textuais — MUST

### PUB-03 — Página do evento

```
┌──────────────────────────────────────┐
│ [Logo venue]              [Calendário]│
├──────────────────────────────────────┤
│ Sexta Live — Banda Norte    [PUBLICADO]│
│ Sex 08/08 · 22h–04h                  │
│                                      │
│ [████████ IMAGEM DO EVENTO ████████] │
│                                      │
│ Atração: Banda Norte                 │
│ Regras: (resumo + “ver mais”)        │
│                                      │
│ Disponibilidade                      │
│  Camarotes: 5 livres · 3 ocupados    │
│                                      │
│ [ Quero reservar ]  ← primário       │
│                                      │
│ Combos e destaques (cards)           │
│ Local · WhatsApp · Instagram         │
└──────────────────────────────────────┘
```

**Estados especiais**

| Estado | UI |
|--------|-----|
| Esgotado | CTA “Esgotado”; sem wizard |
| Cancelado | Banner “Evento cancelado”; sem CTA |
| Encerrado | “Evento encerrado” |

---

### PUB-04 — Experiência

```
┌──────────────────────────────────────┐
│ ← Voltar ao evento                   │
│ Etapa 1 de 6 · Experiência           │
│ ─────────────────────────────────    │
│ Como você quer reservar?             │
│                                      │
│ ┌────────────┐ ┌────────────┐        │
│ │  Camarote  │ │    Mesa    │        │
│ │  Exclusivo │ │  Compart.  │        │
│ └────────────┘ └────────────┘        │
│ ┌────────────┐                       │
│ │ Aniversário│                       │
│ │  + pacote  │                       │
│ └────────────┘                       │
│                                      │
│ ⚠ Solicitação ≠ confirmação          │
└──────────────────────────────────────┘
```

---

### PUB-05 — Espaço

```
┌──────────────────────────────────────┐
│ ←  Etapa 2 · Escolha o espaço        │
│ Experiência: Camarote                │
│                                      │
│ [Lista]  (mapa público = só leitura  │
│           opcional / não MUST)       │
│                                      │
│ ┌─ Camarote 07 ────────── Livre ───┐ │
│ │ Capacidade 4–8  ·  Consumação…   │ │
│ │ Valor: R$ 800                    │ │
│ │ [ Selecionar ]                   │ │
│ └──────────────────────────────────┘ │
│ ┌─ Camarote 01 ────── Indisponível─┐ │
│ │ (disabled)                       │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Mid-flow indisponível (ao selecionar ou no submit posterior):**

> Esse espaço acabou de ficar indisponível. Escolha outro.

Lista atualiza; seleção anterior limpa.

---

### PUB-06 — Dados

```
┌──────────────────────────────────────┐
│ Etapa 3 · Seus dados                 │
│ Espaço: Camarote 07                  │
│                                      │
│ Nome completo *                      │
│ [________________________]           │
│                                      │
│ WhatsApp / telefone *                │
│ [(11) ___________]                   │
│                                      │
│ E-mail (opcional)                    │
│ [________________________]           │
│                                      │
│ CPF (se regra financeira)            │
│ [___.___.___-__]                     │
│ “Usado para controle da reserva,     │
│  não como prova de identidade.”      │
│                                      │
│ Quantidade de pessoas *              │
│ [ − ]  5  [ + ]   (min–max espaço)   │
│                                      │
│ Horário previsto (opcional)          │
│ Tipo de comemoração (opcional)       │
│ Observação para a casa (opcional)    │
│                                      │
│ [ Continuar ]                        │
└──────────────────────────────────────┘
```

Validação inline; não avança com erros.

---

### PUB-07 — Convidados

```
┌──────────────────────────────────────┐
│ Etapa 4 · Convidados                 │
│ Informe até 5 nomes (demo)           │
│                                      │
│ 1. [____________]                    │
│ 2. [____________]                    │
│ …                                    │
│ [ + Adicionar nome ]                 │
│                                      │
│ [ Continuar ]  [ Pular ] (se SHOULD) │
└──────────────────────────────────────┘
```

Aniversário: pode exigir nome do aniversariante na etapa dados ou aqui (ver doc 05).

---

### PUB-08 — Adicionais

```
┌──────────────────────────────────────┐
│ Etapa 5 · Bebidas, comidas e pacotes │
│                                      │
│ Filtros: Todos | Bebidas | Combos    │
│                                      │
│ ┌ Balde Heineken ──── R$ 99 ───────┐ │
│ │ [img]  [ − ] 1 [ + ]             │ │
│ └──────────────────────────────────┘ │
│ ┌ Pacote Aniversário Neon ─ R$ 350 ┐ │
│ │ Benefícios: …  [ Adicionar ]     │ │
│ └──────────────────────────────────┘ │
│ ┌ Item X ──────────── Esgotado ────┐ │
│ │ disabled                         │ │
│ └──────────────────────────────────┘ │
│                                      │
│ Subtotal adicionais: R$ …            │
│ [ Continuar ]                        │
└──────────────────────────────────────┘
```

Preços = vigentes do catálogo; no envio viram snapshot.

---

### PUB-09 — Revisão e envio

```
┌──────────────────────────────────────┐
│ Etapa 6 · Revise e envie             │
│                                      │
│ ┌─ RESUMO ─────────────────────────┐ │
│ │ Evento · Espaço · Pessoas        │ │
│ │ Responsável · Convidados         │ │
│ │ Itens e valores                  │ │
│ │ [Editar] por seção               │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Isto é uma SOLICITAÇÃO.          │ │
│ │ A casa precisa aprovar antes de  │ │
│ │ sua reserva ser confirmada.      │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [ ] Li as regras e a privacidade     │
│                                      │
│ [ Enviar solicitação ]               │
│                                      │
│ (Turnstile invisível / desafio)      │
└──────────────────────────────────────┘
```

**Comportamentos de envio**

| Caso | Comportamento |
|------|----------------|
| Sucesso | Redirect PUB-10; toast “Solicitação enviada” |
| Espaço conflito | Modal → volta PUB-05 atualizado |
| Formulário incompleto | Scroll ao 1º erro (se voltou sem validar) |
| Envio duplicado | Idempotency-Key; mesmo resultado; sem 2ª reserva |
| Antiflood 429 | “Aguarde um momento e tente de novo.” |
| Sem conexão | “Sem conexão. Suas respostas foram mantidas. Tentar de novo.” |

Botão desabilita durante submit (`Enviando…`).

---

### PUB-10 — Status

```
┌──────────────────────────────────────┐
│ Solicitação recebida                 │
│                                      │
│ ●━━━━○━━━━○                          │
│ Recebida  Análise  Confirmação       │
│                                      │
│ Status: Aguardando a casa            │
│                                      │
│ Camarote 07 · 5 pessoas              │
│ Itens: …                             │
│                                      │
│ Guarde este link para acompanhar.    │
│ [ Copiar link ]                      │
│                                      │
│ [ Cancelar solicitação ] (se política)│
└──────────────────────────────────────┘
```

**Mapa de status → hero copy**

| Status | Título | Cor/ênfase |
|--------|--------|------------|
| solicitada | Solicitação recebida — aguardando a casa | Neutro/âmbar |
| aguardando_informacoes | Precisamos de mais informações | Âmbar |
| aguardando_sinal | Aguardando sinal — veja as instruções | Âmbar |
| lista_espera | Você está na lista de espera | Neutro |
| confirmada | Reserva confirmada pela casa | Verde |
| recusada | Não foi possível confirmar | Neutro |
| cancelada_* | Cancelada | Neutro |
| expirada | Solicitação expirada — envie outra se quiser | Neutro |
| cliente_chegou | Check-in realizado | Verde |
| finalizada | Encerrada | Neutro |
| no_show | Não comparecimento registrado | Neutro |

Nunca mostrar observações internas.

---

## 3. Matriz de cenários

| Cenário | Onde | UX |
|---------|------|-----|
| Evento disponível | PUB-03 | CTA ativo |
| Espaço some no fluxo | PUB-05/09 | Mensagem + relista |
| Formulário incompleto | PUB-06/09 | Erros inline |
| Envio duplicado | PUB-09 | Idempotente |
| Antiflood | PUB-09 | 429 humano |
| Enviada | PUB-10 | solicitada |
| Recusada | PUB-10 | copy neutra + CTA outros eventos |
| Confirmada | PUB-10 | confirmada pela casa |
| Aguardando sinal | PUB-10 | instruções manuais (hipótese Pix/processo casa) |
| Lista de espera | PUB-10 | sem garantia de espaço |
| Cancelamento cliente | PUB-10 | confirm dialog |
| Expiração | PUB-10 | CTA nova solicitação |

---

## 4. Rastreabilidade (resumo)

- FR-RESERVATION-001, 002, 010, 018, 019  
- BR-RES-001, 002; BR-SPACE-010; BR-ABUSE-*  
- AC-RES-001, 005; AC-ABUSE-001  
- Personas: P5, P6  
- Risco mitigado: R-P-03 abandono; confirmação falsa  
- Hipóteses: CPF obrigatório; TTL; texto do sinal (gastrobar)  
