# 18 — Decisões de Produto

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Status possíveis:** proposta | aprovada | rejeitada | adiada | em validação  

---

## Tabela de decisões

| ID | Tema | Decisão | Justificativa | Status | Data | Impacto |
|----|------|---------|---------------|--------|------|---------|
| DEC-POS-001 | Posicionamento | Não ser ERP/PDV no MVP; focar evento→reserva→noite | Diferenciação e foco de validação | proposta | 2026-07-30 | Alto |
| DEC-MT-001 | Multi-tenant | Nascer multi-tenant mesmo com 1 venue na demo | Evitar retrabalho estrutural | aprovada | 2026-07-30 | Alto |
| DEC-HOST-001 | Publicação demo | Subdomínio sob `ntws.cloud` | Padrão NTWS Labs | proposta | 2026-07-30 | Médio |
| DEC-CONF-001 | Confirmação | Cliente nunca recebe confirmação antes da aprovação da casa | Princípio 10; expectativa correta | aprovada | 2026-07-30 | Alto |
| DEC-MAP-001 | Mapa visual MVP | Alternativa **D** (template NTWS na implantação) com fallback **B** (grade) | Mais simples, seguro e demonstrável; A é overkill; C é evolução | aprovada | 2026-07-30 | Alto |
| DEC-RT-001 | Tempo real MVP | Polling curto (5–15s) ou SSE; sem WebSocket obrigatório | Proporcional; consistência no banco | aprovada | 2026-07-30 | Médio |
| DEC-CPF-001 | CPF | Obrigatório só com responsabilidade financeira; opcional nos demais; venue pode endurecer | Minimização LGPD + atrito; CPF ≠ identidade | em validação | 2026-07-30 | Alto |
| DEC-STATUS-001 | Estados reserva | Não persistir `em_analise`; fundir `aguardando_confirmacao` de espaço em `pre_reservado`; `em_atendimento` opcional/adiado | Evitar redundância | proposta | 2026-07-30 | Alto |
| DEC-PREP-001 | Preparação | Duas visões: consolidada por item **e** por reserva | Operação real usa ambas | aprovada | 2026-07-30 | Médio |
| DEC-PAY-001 | Pagamento | Sem gateway no MVP; sinal manual com status | Fora do MVP explícito | aprovada | 2026-07-30 | Alto |
| DEC-WA-001 | WhatsApp | Sem API oficial no MVP; link compartilhado manualmente | Escopo e compliance | aprovada | 2026-07-30 | Médio |
| DEC-AI-001 | IA | Não desenvolver agora; manter dados/eventos estruturados | Preparar sem distrair | aprovada | 2026-07-30 | Baixo |
| DEC-CAT-001 | Estoque | Sem estoque completo; status esgotado manual/simples | Foco operacional | aprovada | 2026-07-30 | Médio |
| DEC-BDAY-001 | Aniversário MVP | Pacote + aniversariante + limite + lista básica; RSVP/QR depois | Entregar valor sem overscope | proposta | 2026-07-30 | Médio |
| DEC-SPACE-OCC-001 | Ocupação | Banco como fonte de verdade; constraint de unicidade ocupante | Evitar duplicidade | aprovada | 2026-07-30 | Crítico |
| DEC-WAIT-001 | Lista de espera | Não segura espaço por padrão | Evitar falsos locks | proposta | 2026-07-30 | Alto |
| DEC-SIGNAL-UI-001 | Aguardando sinal | Alerta da reserva; espaço físico permanece pré-reservado | Alinha mapa e domínio | aprovada | 2026-07-30 | Alto |
| DEC-NAV-001 | Nav admin | Hoje Reservas Mapa Prep Eventos + Gestão | Anti-ERP | aprovada | 2026-07-30 | Alto |
| DEC-CAL-001 | Calendário | Visão dentro de Eventos | Menu curto | aprovada | 2026-07-30 | Médio |
| DEC-BDAY-NAV-001 | Aniversários | Tipo/filtro de reserva, não seção principal | Simplicidade | aprovada | 2026-07-30 | Médio |
| DEC-TTL-001 | TTL 12h | Hipótese visual apenas | Validar com gastrobar | em validação | 2026-07-30 | Médio |
| DEC-AUDIT-001 | Auditoria | Histórico de status MUST + AuditLog ações críticas MUST | Rastreabilidade | proposta | 2026-07-30 | Alto |
| DEC-UX-001 | Home admin | Visão de hoje como tela inicial | Princípio 6 | aprovada | 2026-07-30 | Alto |
| DEC-PRICE-001 | Preço validação | Testar disposição a R$ 229,90/mês | Hipótese comercial de validação | em validação | 2026-07-30 | Comercial |
| DEC-NAME-001 | Nome | “Gestor Camarote” como nome de trabalho | Pode mudar após validação | proposta | 2026-07-30 | Baixo |
| DEC-LANG-001 | Idioma | pt-BR apenas no MVP | Foco | proposta | 2026-07-30 | Baixo |
| DEC-PUB-001 | Site | Personalização leve; sem page builder | Escopo | aprovada | 2026-07-30 | Médio |
| DEC-NOSHOW-001 | No-show | Marcação humana; espaço reabre por padrão | Operação da noite | aprovada | 2026-07-30 | Médio |
| DEC-ORIGIN-001 | Reserva admin | Mesmo agregado Reservation com origin=admin | Modelo único | proposta | 2026-07-30 | Médio |
| DEC-SNAP-001 | Preços | Snapshot em ReservationItem | Histórico comercial leve | aprovada | 2026-07-30 | Médio |
| DEC-DATA-001 | Fonte de dados | Site público e painel compartilham a mesma fonte | Princípio 14–15 | aprovada | 2026-07-30 | Alto |
| DEC-NOTES-001 | Observações internas | Nunca exibidas ao cliente | Princípio de privacidade operacional | aprovada | 2026-07-30 | Alto |
| DEC-NATIVE-001 | App nativo | Fora do MVP | Escopo | aprovada | 2026-07-30 | Médio |
| DEC-MAP-EDIT-001 | Editor livre de planta | Fora do MVP | Escopo | aprovada | 2026-07-30 | Médio |

---

## Decisões sobre alternativas de mapa (detalhe)

| Alternativa | Descrição | MVP? |
|-------------|-----------|------|
| A | Mapa configurável livremente | Não — complexo e arriscado |
| B | Grade simplificada | Fallback aceitável |
| C | Upload de planta + pins | Pós-piloto / Fase 3 |
| D | Template NTWS na implantação | **Recomendada** |

---

## Decisões sobre coleta de dados (resumo)

| Campo | Decisão |
|-------|---------|
| Nome | Obrigatório |
| Telefone/WhatsApp | Obrigatório |
| E-mail | Opcional SHOULD |
| CPF | Condicional (DEC-CPF-001) |
| Nascimento | Condicional aniversário |
| Qtd pessoas | Obrigatório |

---

## Como aprovar

1. Revisar esta tabela em workshop PO + stakeholders.  
2. Mudar status para `aprovada` / `rejeitada` / `em validação`.  
3. Questões vinculadas: ver [17_OPEN_QUESTIONS.md](17_OPEN_QUESTIONS.md).  
4. Atualizar data e impacto se a decisão mudar.

**Nenhuma decisão desta tabela está “aprovada” automaticamente** — todas nascem como **proposta** nesta fase documental.
