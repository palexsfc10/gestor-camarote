# 08 — Regras de Negócio

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

IDs: BR-\<ÁREA\>-\<NNN\>

---

## 1. Multi-tenant e organização

| ID | Regra |
|----|-------|
| BR-MT-001 | Todo dado operacional pertence a um Venue (e Organization). |
| BR-MT-002 | Usuário só opera nos venues aos quais está vinculado. |
| BR-MT-003 | Links públicos são escopados ao venue/evento; não listam outros tenants. |

---

## 2. Eventos

| ID | Regra |
|----|-------|
| BR-EVENT-001 | Somente eventos `publicado` aceitam novas solicitações públicas. |
| BR-EVENT-002 | Evento `cancelado` não aceita novas reservas; reservas abertas seguem política de cancelamento em massa. |
| BR-EVENT-003 | Alterar data/hora com reservas `confirmada` exige confirmação admin e registro em audit; idealmente notifica clientes (SHOULD). |
| BR-EVENT-004 | Despublicar remove da descoberta pública, mas mantém reservas existentes gerenciáveis no admin. |
| BR-EVENT-005 | Arquivar é estado terminal de catálogo; não aparece em próximos eventos. |
| BR-EVENT-006 | Site e calendário leem o mesmo registro de Event. |

---

## 3. Espaços e ocupação

| ID | Regra |
|----|-------|
| BR-SPACE-001 | Para um EventSpace, no máximo **uma** reserva em estado ocupante ativo. |
| BR-SPACE-002 | Estados ocupantes ativos (MVP): `solicitada` (pré-reserva), `aguardando_informacoes`, `aguardando_sinal`, `confirmada`, `cliente_chegou`, `em_atendimento` (se usado). |
| BR-SPACE-003 | Estados que **liberam** espaço: `recusada`, `cancelada_*`, `expirada`, `no_show` (conforme política de reabertura), e remoção de bloqueio. |
| BR-SPACE-004 | Bloqueio/manutenção impede seleção pública e confirmação para aquele espaço. |
| BR-SPACE-005 | Capacidade da reserva deve estar entre capacityMin e capacityMax do EventSpace (ou defaults do SpaceType). |
| BR-SPACE-006 | Espaço inativo no venue não pode ser incluído em novos eventos. |

### Conflito

| ID | Regra |
|----|-------|
| BR-SPACE-010 | Em concorrência, a primeira transação bem-sucedida vence; a segunda falha com indisponibilidade. |
| BR-SPACE-011 | UI hold (se existir) **não** substitui a constraint; é apenas UX. |

---

## 4. Tipos de reserva

Cada tipo pode definir: capacidade min/max, valor, consumação mínima, sinal, horário limite de chegada, regras, itens incluídos, adicionais permitidos, cancelamento, no-show.

| Tipo | Diferenças principais | MVP |
|------|----------------------|-----|
| **Camarote** | Espaço exclusivo; frequentemente valor/consumação/sinal; CPF recomendado se houver responsabilidade financeira | MUST |
| **Mesa** | Menor ticket; pode ser sem sinal; CPF opcional | MUST |
| **Bistrô** | SpaceType; regras como mesa/camarote conforme casa | SHOULD |
| **Área VIP** | SpaceType; pode agrupar múltiplos assentos/áreas | SHOULD |
| **Aniversário** | Pacote + aniversariante + limite convidados + benefícios | MUST parcial |
| **Lista de convidados** | Foco em nomes/entrada; pode não prender mesa específica | SHOULD |
| **Cortesia** | Origem admin; valor zero; motivo obrigatório | COULD |
| **Reserva interna** | Admin; pode confirmar direto | SHOULD |
| **Bloqueio manual** | Não é reserva de cliente; ocupa/impede | SHOULD |
| **Manutenção** | Indisponibilidade física | COULD |
| **Admin em nome do cliente** | Mesmo modelo Reservation; `origin=admin` | SHOULD |

| ID | Regra |
|----|-------|
| BR-TYPE-001 | Modalidades disponíveis são configuráveis por venue/evento. |
| BR-TYPE-002 | Lista de convidados sem espaço físico não aplica BR-SPACE-001 de mesa, mas pode ter limite de capacidade do evento. |
| BR-TYPE-003 | Cortesia e interna exigem usuário admin autenticado. |
| BR-TYPE-004 | Bloqueio não gera preparação de catálogo. |

---

## 5. Reservas — ciclo de vida

| ID | Regra |
|----|-------|
| BR-RES-001 | Toda solicitação pública inicia como `solicitada`, nunca `confirmada`. |
| BR-RES-002 | Cliente só vê “confirmada” após ação da casa (ou admin origin que confirme). |
| BR-RES-003 | Confirmação só é possível se o EventSpace continuar disponível para aquela reserva. |
| BR-RES-004 | Recusa/cancelamento/expiração liberam o espaço atomicamente com a transição. |
| BR-RES-005 | Observações internas nunca são expostas no token público. |
| BR-RES-006 | Itens de catálogo só entram em preparação quando a reserva atinge status configurado (default: `confirmada`). |
| BR-RES-007 | Cancelamento após confirmação cancela itens de preparação não entregues. |
| BR-RES-008 | Pré-reserva/solicitação expira após TTL configurável (proposta inicial: 2–24 h; validar com casa). |
| BR-RES-009 | `no_show` só após `confirmada` (ou chegou? não) e política de horário — tipicamente no dia do evento. |
| BR-RES-010 | `finalizada` é terminal operacional positiva. |
| BR-RES-011 | Telefone do responsável é obrigatório no MVP público. |
| BR-RES-012 | E-mail é SHOULD (recuperação de link / comunicação). |
| BR-RES-013 | Quantidade de pessoas obrigatória. |

---

## 6. CPF e identificação

| ID | Regra |
|----|-------|
| BR-CPF-001 | CPF **não** é prova de identidade. |
| BR-CPF-002 | Se coletado: validar dígitos verificadores. |
| BR-CPF-003 | **Recomendação:** CPF obrigatório apenas em reservas com responsabilidade financeira (valor, consumação mínima ou sinal > 0, ou pacote pago). Opcional nos demais; venue pode endurecer. |
| BR-CPF-004 | Unicidade de CPF por evento: SHOULD quando CPF exigido — um CPF ativo por evento (estados não terminais). |
| BR-CPF-005 | Exibir mascarado (\\*\\*\\*\\*.\\*\\*\\*.\\*\\*-99) por padrão. |

---

## 7. Unicidade e abuso

| ID | Regra |
|----|-------|
| BR-ABUSE-001 | Rate limit por IP + fingerprint leve no POST público. |
| BR-ABUSE-002 | Idempotency key obrigatória no cliente web no submit. |
| BR-ABUSE-003 | Turnstile/CAPTCHA no submit público (SHOULD → MUST se abuso). |
| BR-ABUSE-004 | Telefone único por evento para reservas ativas: recomendado; validar com casa (pode haver exceções legítimas). |

---

## 8. Catálogo e adicionais

| ID | Regra |
|----|-------|
| BR-CAT-001 | Item `inativo` ou `esgotado` não pode ser adicionado em novas reservas. |
| BR-CAT-002 | Limite por evento, se definido, é enforce no submit e na edição admin. |
| BR-CAT-003 | Preço exibido no público deve ser o preço vigente do item no momento da solicitação (snapshot na ReservationItem). |
| BR-CAT-004 | Não há baixa de estoque financeiro/físico completo no MVP. |
| BR-CAT-005 | Mesmo cadastro alimenta site, evento, reserva e preparação. |

---

## 9. Aniversários e convidados

| ID | Regra |
|----|-------|
| BR-BDAY-001 | Pacote define benefícios e limite de convidados. |
| BR-BDAY-002 | Lista não pode exceder limite do pacote/evento (salvo override admin). |
| BR-BDAY-003 | Nome exibido (para equipe) é distinto do nome civil se necessário. |
| BR-BDAY-004 | Link de convidados só funciona para reserva/aniversário válido não cancelado. |
| BR-BDAY-005 | Convidado informa dados mínimos (nome); telefone opcional no MVP. |

---

## 10. Preparação

| ID | Regra |
|----|-------|
| BR-PREP-001 | Visões por reserva e consolidada por item coexistentes. |
| BR-PREP-002 | Status de preparação independe do status de pagamento (MVP sem gateway). |
| BR-PREP-003 | Item cancelado não deve permanecer “pronto” ativo sem marcação cancelado. |

---

## 11. Pagamento / sinal

| ID | Regra |
|----|-------|
| BR-PAY-001 | MVP registra sinal como status/valor/instrução manual — sem captura online. |
| BR-PAY-002 | `aguardando_sinal` não implica confirmação de espaço definitiva além da pré-reserva vigente. |
| BR-PAY-003 | Admin marca sinal recebido (SHOULD) antes ou junto da confirmação, conforme processo da casa. |

---

## 12. Visão de hoje

| ID | Regra |
|----|-------|
| BR-TODAY-001 | “Hoje” usa timezone do venue. |
| BR-TODAY-002 | Prioriza pendências acionáveis sobre gráficos. |

---

## 13. Políticas de cancelamento e no-show (framework)

Valores específicos = configuração do venue (abrir questões).

| ID | Regra |
|----|-------|
| BR-POL-001 | Cada SpaceType/EventSpace pode declarar política textual exibida no público. |
| BR-POL-002 | No-show após horário limite de chegada (se configurado) pode ser sugerido ao admin; marcação é humana no MVP. |
| BR-POL-003 | Reabertura de espaço após no-show é imediata por padrão (para aproveitar noite), salvo bloqueio admin. |
