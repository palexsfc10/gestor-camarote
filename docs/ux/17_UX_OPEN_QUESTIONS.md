# UX 17 — Questões Abertas de UX

**Produto:** Gestor Camarote  
**Inclui:** hipóteses do gastrobar + conflitos documentais + pendências de design  

---

## 1. Dependentes do gastrobar (validação)

| ID | Pergunta | Por que importa | Hipótese UX atual | Validar |
|----|----------|-----------------|-------------------|---------|
| UX-GQ-01 | Planta real e posição dos 8 camarotes + palco/backstage? | Template do mapa demo | Fileiras 4+4 com palco central (fictício) | Sim OQ-005 |
| UX-GQ-02 | CPF obrigatório em quais reservas? | Campos PUB-06 | Só responsabilidade financeira | Sim OQ-002 |
| UX-GQ-03 | TTL de pré-reserva? | Copy expiração / alertas Hoje | 12h | Sim OQ-001 |
| UX-GQ-04 | Processo e texto do sinal (Pix etc.)? | PUB-10 + modal admin | Campo texto livre admin | Sim OQ-006 |
| UX-GQ-05 | Cardápio/pacotes reais da demo? | PUB-08 credibilidade | Balde + Pacote Neon fictícios | Sim OQ-015 |
| UX-GQ-06 | Aniversário sempre com espaço dedicado? | Wizard | Sim na demo | Sim |
| UX-GQ-07 | Usarão link de convidados na 1ª noite? | PUB-11 MUST vs SHOULD | SHOULD | Sim |
| UX-GQ-08 | Lista de pista além de camarote/mesa? | PUB-04 modalidades | Não no menu MVP | Sim OQ-013 |
| UX-GQ-09 | Horário limite de chegada? | Check-in / no-show UX | Campo opcional + marcação humana | Sim OQ-014 |
| UX-GQ-10 | Telefone único por evento? | Erro no submit | Bloquear 2ª ativa + override admin | Sim OQ-003 |

---

## 2. Questões de design / IA

| ID | Pergunta | Opções | Recomendação UX |
|----|----------|--------|-----------------|
| UX-OQ-01 | Calendário como item de menu separado? | Separado / dentro de Eventos | Dentro de Eventos (aprovado nesta spec) |
| UX-OQ-02 | Aniversários no menu primário? | Sim / filtro em Reservas | Filtro + card em Hoje |
| UX-OQ-03 | Clientes no MVP nav? | Sim Gestão / adiar | Gestão SHOULD |
| UX-OQ-04 | Mobile mapa: default Lista ou Mapa? | Lista / Mapa | Lista se denso; validar piloto |
| UX-OQ-05 | Branding site: save = publicar imediato? | Imediato / rascunho | Imediato no MVP |
| UX-OQ-06 | Master-detail reservas no desktop breakpoint | 1200px? | 1200px hipótese |
| UX-OQ-07 | Mostrar mini-mapa no fluxo público? | Sim / não | Não MUST; lista basta |
| UX-OQ-08 | Chip “Sinal” no mapa além de Pré? | Sim / só Pré | Sim (ênfase visual) — ver conflito abaixo |

---

## 3. Conflitos / tensões documentais encontrados

| ID | Tensão | Detalhe | Resolução UX provisória |
|----|--------|---------|-------------------------|
| UX-CF-01 | Status espaço doc 10 vs pedido UX mapa com “aguardando sinal” | Domínio funde aguardando_confirmação em pré-reservado; UX pede status visual “aguardando sinal” | Tratar “Sinal” como **ênfase visual** de pré-reserva quando reserva `aguardando_sinal` — sem novo estado persistido de espaço |
| UX-CF-02 | Menu 11 itens vs “não parecer ERP” | Lista solicitada completa | Agrupar: 5 primários + Gestão; Aniversários/Calendário não separados |
| UX-CF-03 | `docs/12` admin menu antigo vs `ux/01` | Doc 12 lista Fila/Espaços separados | Prevalece `ux/01` nesta fase; doc 12 torna-se diretrizes gerais |
| UX-CF-04 | PUB-07 MUST na demo vs SHOULD no inventário | Convidados | MUST para demo camarote/aniversário; skip opcional mesa simples |
| UX-CF-05 | DEC-NOSHOW ainda “proposta” vs UX assume reabertura | Produto | UX especifica reabertura default; confirmar aprovação formal |
| UX-CF-06 | `em_atendimento` | Doc 10 adia; não pedido no mapa UX | Não representar no mapa MVP |

**Nenhum FR foi alterado.** Se engenharia precisar de estado persistido “sinal” no EventSpace, abrir FR/BR explicitamente.

---

## 4. Pronto para quê?

Ver veredicto em `18_UX_REVIEW_REPORT.md`.
