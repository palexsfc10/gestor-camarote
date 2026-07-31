# 14 — Analytics e Métricas de Sucesso

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Preço de validação comercial citado:** R$ 229,90/mês  

---

## 1. Objetivo das métricas

Validar se o MVP/demo/piloto prova **utilidade operacional** e **disposição a pagar**, não vanity metrics.

---

## 2. Métricas de produto

| Métrica | Definição | Alvo piloto (proposta) |
|---------|-----------|------------------------|
| Eventos cadastrados | Contagem de eventos criados no sistema | ≥ 4 em 30 dias |
| Eventos publicados | Eventos que ficaram públicos | ≥ 3 |
| Reservas recebidas | Solicitações criadas via fluxo público/admin | ≥ 30 |
| Taxa de conversão visita→solicitação | Solicitações / sessões na página do evento | Baseline + tendência |
| % solicitações com adicionais | Reservas com ≥1 ReservationItem | ≥ 40% |
| Tempo até primeira ação admin | Mediana entre create e primeira transição | ≤ 2 h (dias de operação) |
| Uso do mapa | Sessões admin com abertura do mapa no dia do evento | ≥ 1 por evento |
| Uso Visão de hoje | Aberturas no D-day | ≥ 3 por evento |

---

## 3. Métricas operacionais

| Métrica | Definição | Alvo / observação |
|---------|-----------|-------------------|
| Reservas confirmadas | status confirmada+ | Acompanhar volume |
| Taxa de confirmação | confirmadas / solicitações | Baseline |
| Tempo médio de resposta | solicitada → confirmada/recusada | ↓ vs WhatsApp declarado |
| Canceladas (cliente/casa) | contagem e % | Monitorar |
| No-show | % sobre confirmadas | Baseline |
| Pessoas esperadas vs chegaram | partySize vs check-ins | Qualidade operação |
| Preparações concluídas | pronto/entregue / total | ≥ 80% no D-day |
| Conflitos de espaço evitados | tentativas de API que falharam por indisponibilidade | > 0 é sinal de proteção OK |
| Espaços reabertos após no-show | contagem | Operação ágil |

**Pesquisa qualitativa (equipe):** “Quantas conversas de WhatsApp a menos?” — estimativa autodeclarada semanal.

---

## 4. Métricas comerciais

| Métrica | Definição |
|---------|-----------|
| Disposição a pagar R$ 229,90/mês | Resposta do decisor (sim/não/talvez + condições) |
| Valor potencial dos adicionais | Soma de snapshots de ReservationItems confirmados |
| Percepção de ROI | Entrevista: tempo economizado, brigas evitadas |
| Intenção de continuar no piloto | sim/não |

---

## 5. Métricas de validação (go / no-go)

Sinais **positivos** para avançar à Fase 3/4:

1. ≥ 1 evento real operado com o painel no dia.  
2. ≥ 10 reservas reais pelo link público.  
3. Zero incidentes de dupla ocupação confirmada.  
4. Equipe usa mapa ou visão de hoje sem planilha paralela dominante.  
5. Decisor indica sim ou “sim com ajustes” ao preço-alvo.

Sinais de **alerta**:

- Casa abandona o sistema na primeira noite.  
- Formulário público com abandono > 70% (medido).  
- Exigência imediata de PDV/fiscal para ver valor.  
- Recusa de usar por causa de CPF/dados.

---

## 6. Instrumentação mínima (conceito)

Eventos analíticos (sem PII):

- `event_published`  
- `reservation_submitted`  
- `reservation_status_changed`  
- `space_conflict_rejected`  
- `checkin_recorded`  
- `preparation_status_changed`  
- `public_event_view`  

Propriedades: venueId, eventId, status, type, hasItems (bool), durationMs — **sem** nome/telefone/CPF.

---

## 7. Cadência de revisão

| Momento | O quê |
|---------|-------|
| Pós-demo | Feedback qualitativo + script completo? |
| Semanal no piloto | Produto + operacional |
| Fim do piloto (2–4 semanas) | Comercial + go/no-go |

---

## 8. O que não medir no MVP

- NPS de massa de consumidores  
- LTV de 12 meses  
- Market share  
- Precisão de modelo de IA  
