# UX 16 — Rastreabilidade UX ↔ Requisitos

**Produto:** Gestor Camarote  
**Regra:** não alterar FRs/BRs/ACs silenciosamente; conflitos → `17_UX_OPEN_QUESTIONS.md`  

---

## 1. Telas MUST × rastreio

| Tela | FRs | BRs / DECs | ACs | Persona | Risco mitigado | Hipótese pendente |
|------|-----|------------|-----|---------|----------------|-------------------|
| AUTH-01 | FR-AUTH-001,004 | BR-MT-* | — | P1–P4 | R-T-02 | — |
| PUB-01 | FR-PUBLIC-SITE-001, FR-VENUE-003 | DEC-PUB, DEC-DATA | — | Público | — | Branding real |
| PUB-02 | FR-CALENDAR-001..003 | BR-EVENT-006 | AC-EVT-001 | Público | — | — |
| PUB-03 | FR-PUBLIC-SITE-002..004 | BR-EVENT-001,002 | AC-EVT-002 | P5 | — | — |
| PUB-04 | FR-RESERVATION-001,019 | BR-TYPE-* | AC-RES-001 | P5/P6 | — | Modalidades da casa |
| PUB-05 | FR-RESERVATION-001,002 FR-SPACE-* | BR-SPACE-001,010 | AC-RES-CONCURRENCY | P5 | R-T-01 | Planta/labels |
| PUB-06 | FR-RESERVATION-001 | BR-RES-011..013 BR-CPF-* | — | P5 | R-L-02 R-P-03 | CPF casa OQ-002 |
| PUB-07 | FR-GUEST-001,002 | BR-BDAY-002 | — | P5/P6 | — | Lista obrigatória? |
| PUB-08 | FR-CATALOG-005 | BR-CAT-* DEC-SNAP | AC-CAT-001,002 | P5 | — | Catálogo real OQ-015 |
| PUB-09 | FR-RESERVATION-001,018 | BR-ABUSE-* BR-RES-001 | AC-RES-001,005 AC-ABUSE-001 | P5 | R-P-03 | Turnstile |
| PUB-10 | FR-AUTH-003 | DEC-CONF DEC-NOTES | AC-AUTH-003 AC-RES-002 | P5 | Confirmação falsa | Canal WhatsApp manual |
| ADM-01 | FR-ADMIN-001..003 | BR-TODAY DEC-UX-001 | AC-TODAY-001 | P1–P4 | R-P-01 | — |
| ADM-02 | FR-RESERVATION-003 | — | — | P2 | — | — |
| ADM-03 | FR-RESERVATION-004..017 FR-AUDIT-001 | BR-RES-* DEC-NOTES | AC-RES-002..007 AC-PRIV-001 | P2 | R-O-01 | Sinal OQ-006 |
| ADM-04 | (transversal) | BR-RES-004,007 | AC-RES-003,006 | P2 | Erro humano | — |
| ADM-05 | FR-SPACE-005 | DEC-MAP-001 | AC-MAP-001 | P2/P3 | R-P-04 | Planta OQ-005 |
| ADM-06/07 | FR-PREPARATION-001..005 | DEC-PREP BR-PREP | AC-PREP-001,002 | P4 | Item cancelado | — |
| ADM-09..11 | FR-EVENT-* | BR-EVENT-* | AC-EVT-001,002 | P1/P2 | — | — |
| ADM-12/13 | FR-CATALOG-* | DEC-CAT DEC-SNAP | AC-CAT-* | P1/P2 | — | OQ-015 |
| ADM-14 | FR-VENUE-003 FR-PUBLIC-SITE-003 | DEC-PUB DEC-DATA | — | P1 | — | Preview fidelity |
| ADM-16..18 | FR-VENUE-001,002 FR-AUTH-002 FR-SPACE-002 | BR-MT | AC-AUTH-001,002 | P1 | — | Preferências TTL |

---

## 2. Fluxos × rastreio

| Fluxo UX | Docs | FRs principais | ACs |
|----------|------|----------------|-----|
| Público solicitação | ux/03 | RESERVATION, CATALOG, GUEST | AC-RES-001,005 |
| Admin operação / hoje | ux/04 | ADMIN, RESERVATION | AC-TODAY, AC-RES-002+ |
| Aniversário | ux/05 | BIRTHDAY, GUEST | AC-BDAY-001 |
| Preparação | ux/06 | PREPARATION | AC-PREP-* |
| Check-in | ux/07 | RESERVATION-012..014 | AC-CLI-* |
| Mapa | ux/08 | SPACE-005 | AC-MAP-001 |
| Eventos/calendário | ux/09 | EVENT, CALENDAR, PUBLIC | AC-EVT-* |
| Catálogo/site | ux/10 | CATALOG, VENUE, PUBLIC | AC-CAT-* |

---

## 3. Decisões aprovadas × UX

| DEC | Reflexo UX |
|-----|------------|
| Multi-tenant | Contexto venue; sem cross-nav |
| Nunca confirmada ao nascer | Copy wizard + PUB-10 |
| Banco fonte de verdade | Mensagens de conflito; sem hold UI autoritário |
| Mesma fonte site/admin | Preview e “ver site” |
| Mapa NTWS + grade fallback | ADM-05 template/grade |
| Visão de hoje home | ADM-01 = `/admin` |
| Prep dual | Toggle A/B |
| Snapshot | Aviso ao mudar preço |
| Obs internas ocultas | PUB-10 sem campo; ADM-03 com |
| Sem PDV/estoque/pay/WA/IA/editor/app | Fora do inventário MUST |
| Polling/SSE | Indicador frescor |
| R$ 229,90 | Só no fecho da demo (hipótese) |

---

## 4. Itens conscientemente não rastreados a FR novo

Nenhuma alteração silenciosa de requisito. Sugestões de clarificação estão apenas em `17_UX_OPEN_QUESTIONS.md` (UX-OQ-*).
