# 05 — Requisitos Funcionais

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Prioridades:** MUST | SHOULD | COULD | WON’T NOW  

Cada requisito segue o padrão: ID, título, descrição, ator, pré-condições, fluxo principal, alternativos, exceções, regras, prioridade, dependências, dados, critérios de aceite.

Critérios detalhados Given/When/Then também em [13_ACCEPTANCE_CRITERIA.md](13_ACCEPTANCE_CRITERIA.md).

---

## FR-AUTH — Autenticação e acesso

### FR-AUTH-001 — Login de usuários do estabelecimento

| Campo | Conteúdo |
|-------|----------|
| **Título** | Autenticar usuário administrativo |
| **Descrição** | Usuário do venue acessa o painel com credenciais válidas. |
| **Ator** | P1–P4 |
| **Pré-condições** | Usuário ativo vinculado a um Venue |
| **Fluxo principal** | 1. Informa e-mail/senha 2. Sistema autentica 3. Redireciona ao painel do venue |
| **Alternativos** | Recuperação de senha (SHOULD) |
| **Exceções** | Credencial inválida; usuário inativo; tenant suspenso |
| **Regras** | BR-MT-001 isolamento por tenant |
| **Prioridade** | MUST |
| **Dependências** | FR-VENUE-002 |
| **Dados** | email, senha (hash), venueId, role |
| **Aceite** | Somente usuários do tenant acessam dados daquele venue |

### FR-AUTH-002 — Controle de papéis

| Campo | Conteúdo |
|-------|----------|
| **Título** | Autorização por papel |
| **Descrição** | Ações administrativas respeitam papéis (gestor, reservas, recepção, preparação). |
| **Ator** | Sistema / P1 |
| **Pré-condições** | Usuário autenticado |
| **Fluxo principal** | Sistema verifica permissão antes de mutação |
| **Exceções** | 403 sem permissão; tentativa registrada em audit se crítica |
| **Prioridade** | MUST |
| **Dependências** | FR-AUTH-001, FR-AUDIT-001 |
| **Dados** | role, permission |
| **Aceite** | Recepção não edita preços; preparação não confirma reserva |

### FR-AUTH-003 — Acesso do cliente à solicitação

| Campo | Conteúdo |
|-------|----------|
| **Título** | Acompanhar status via link |
| **Descrição** | Cliente acessa status da solicitação por link/token sem conta obrigatória. |
| **Ator** | P5 |
| **Pré-condições** | Reserva criada; token válido |
| **Fluxo principal** | Abre link → vê status e resumo → sem dados sensíveis extras |
| **Exceções** | Token expirado/inválido |
| **Prioridade** | MUST |
| **Dados** | reservationPublicId, status, resumo não sensível |
| **Aceite** | Link não lista outras reservas do venue |

### FR-AUTH-004 — Sessão e logout

| Campo | Conteúdo |
|-------|----------|
| **Título** | Encerrar sessão administrativa |
| **Prioridade** | MUST |
| **Aceite** | Após logout, rotas admin exigem nova autenticação |

---

## FR-VENUE — Estabelecimento

### FR-VENUE-001 — Cadastro e edição do venue

| Campo | Conteúdo |
|-------|----------|
| **Título** | Manter dados do estabelecimento |
| **Descrição** | Gestor define nome, endereço, contatos, horários, redes. |
| **Ator** | P1 |
| **Prioridade** | MUST |
| **Dados** | name, address, phone, whatsapp, instagram, hours |
| **Aceite** | Alterações refletem na página pública após publicação/salvamento |

### FR-VENUE-002 — Usuários do venue

| Campo | Conteúdo |
|-------|----------|
| **Título** | Convidar e gerenciar VenueUser |
| **Ator** | P1 |
| **Prioridade** | MUST |
| **Aceite** | Usuário inativado perde acesso imediatamente na próxima requisição autenticada |

### FR-VENUE-003 — Personalização da página pública

| Campo | Conteúdo |
|-------|----------|
| **Título** | PublicPageSettings |
| **Descrição** | Logo, cores, imagens, banner — sem page builder. |
| **Ator** | P1 |
| **Prioridade** | MUST |
| **Aceite** | Site usa as configurações do tenant; outro tenant não herda |

### FR-VENUE-004 — Isolamento multi-tenant

| Campo | Conteúdo |
|-------|----------|
| **Título** | Isolar dados por Organization/Venue |
| **Prioridade** | MUST |
| **Aceite** | Qualquer listagem/API filtra por tenant; teste de tentativa cross-tenant falha |

---

## FR-SPACE — Espaços

### FR-SPACE-001 — Cadastro de tipos de espaço

| Campo | Conteúdo |
|-------|----------|
| **Título** | SpaceType configurável |
| **Descrição** | Camarote, mesa, bistrô, VIP, outros. |
| **Ator** | P1 / NTWS implantação |
| **Prioridade** | MUST |
| **Dados** | name, code, defaultCapacityMin/Max, rules |

### FR-SPACE-002 — Cadastro de espaços físicos

| Campo | Conteúdo |
|-------|----------|
| **Título** | VenueSpace |
| **Descrição** | Espaços numerados/nomeados com capacidade e posição no mapa. |
| **Ator** | P1 |
| **Prioridade** | MUST |
| **Dados** | code, name, type, capacityMin, capacityMax, mapPosition, active |

### FR-SPACE-003 — Status operacional do espaço no evento

| Campo | Conteúdo |
|-------|----------|
| **Título** | Estado do EventSpace |
| **Descrição** | Disponibilidade derivada de reservas/bloqueios do evento. |
| **Prioridade** | MUST |
| **Regras** | BR-SPACE-001 a BR-SPACE-004 |
| **Aceite** | Dois confirmados no mesmo EventSpace são impossíveis |

### FR-SPACE-004 — Bloqueio manual e manutenção

| Campo | Conteúdo |
|-------|----------|
| **Título** | Bloquear espaço |
| **Ator** | P1, P2 |
| **Prioridade** | SHOULD |
| **Aceite** | Espaço bloqueado não aparece como selecionável no fluxo público |

### FR-SPACE-005 — Mapa visual

| Campo | Conteúdo |
|-------|----------|
| **Título** | Visualizar mapa da casa no evento |
| **Descrição** | Exibe espaços com status visual; ao selecionar, mostra detalhe da reserva. |
| **Ator** | P2, P3 |
| **Prioridade** | MUST |
| **Dependências** | Template/grade (DEC-MAP-001) |
| **Aceite** | Status visual corresponde ao estado persistido; detalhe mostra responsável mascarado conforme política |

---

## FR-EVENT — Eventos

### FR-EVENT-001 — Criar evento

| Campo | Conteúdo |
|-------|----------|
| **Título** | Criar evento |
| **Ator** | P1, P2 |
| **Fluxo** | Informa título, data, horários, atração, imagem, regras → salva rascunho |
| **Prioridade** | MUST |
| **Dados** | title, startsAt, endsAt, attraction, image, rules, status |

### FR-EVENT-002 — Editar evento

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Exceções** | Edição de data com reservas confirmadas exige confirmação e regras BR-EVENT-003 |

### FR-EVENT-003 — Publicar / despublicar

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Publicação torna o evento visível no site/calendário. |
| **Prioridade** | MUST |
| **Aceite** | Despublicado some da listagem pública de próximos (admin ainda vê) |

### FR-EVENT-004 — Duplicar evento

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |
| **Aceite** | Cópia inicia como rascunho; espaços/preços copiáveis conforme opção |

### FR-EVENT-005 — Cancelar / reagendar / arquivar

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST (cancelar); SHOULD (reagendar/arquivar) |
| **Efeitos** | Cancelamento notifica status das reservas abertas (política BR-EVENT-004) |

### FR-EVENT-006 — Disponibilizar espaços no evento

| Campo | Conteúdo |
|-------|----------|
| **Título** | EventSpace pricing e regras |
| **Descrição** | Define quais espaços entram, preço, consumação, sinal, capacidades, itens incluídos. |
| **Prioridade** | MUST |

### FR-EVENT-007 — Evento recorrente

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | WON’T NOW |

---

## FR-CALENDAR — Calendário

### FR-CALENDAR-001 — Calendário público interativo

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Exibe eventos por dia/semana; indica esgotado/cancelado. |
| **Ator** | Público |
| **Prioridade** | MUST |
| **Aceite** | Dados iguais aos do painel para o mesmo evento publicado |

### FR-CALENDAR-002 — Filtros hoje / semana / próximos

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-CALENDAR-003 — Link direto para reserva do evento

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

---

## FR-PUBLIC-SITE — Site público

### FR-PUBLIC-SITE-001 — Página do estabelecimento

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Home com próximos eventos, localização, contato, redes, cardápio/combos em destaque. |
| **Prioridade** | MUST |

### FR-PUBLIC-SITE-002 — Página do evento

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Detalhe: atração, horários, regras, disponibilidade, CTA de reserva, itens. |
| **Prioridade** | MUST |

### FR-PUBLIC-SITE-003 — Atualização automática após admin

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Alterações publicadas no painel refletem no site sem redeploy manual de conteúdo. |
| **Prioridade** | MUST |
| **Aceite** | Após salvar/publicar, GET público retorna dados atualizados (dentro do SLA NFR) |

### FR-PUBLIC-SITE-004 — Estados esgotado / cancelado

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Aceite** | Evento esgotado não permite nova solicitação de espaços esgotados; cancelado não inicia reserva |

---

## FR-RESERVATION — Reservas

### FR-RESERVATION-001 — Solicitar reserva (público)

| Campo | Conteúdo |
|-------|----------|
| **Ator** | P5 |
| **Pré-condições** | Evento publicado; espaço disponível |
| **Fluxo** | Modalidade → espaço → dados → pessoas → adicionais → envio → status `solicitada` |
| **Prioridade** | MUST |
| **Regras** | BR-RES-001..; cliente NÃO recebe confirmação de reserva |
| **Aceite** | Mensagem explícita de “solicitação enviada, aguardando a casa” |

### FR-RESERVATION-002 — Impedir duplicidade de espaço

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Banco/regra de concorrência garante no máximo uma reserva ativa ocupante por EventSpace. |
| **Prioridade** | MUST |
| **Aceite** | Ver AC-RES-CONCURRENCY-001 |

### FR-RESERVATION-003 — Fila administrativa

| Campo | Conteúdo |
|-------|----------|
| **Ator** | P2 |
| **Prioridade** | MUST |
| **Aceite** | Novas solicitações aparecem na fila dentro do SLA de atualização do painel |

### FR-RESERVATION-004 — Confirmar reserva

| Campo | Conteúdo |
|-------|----------|
| **Ator** | P2 |
| **Efeitos** | Status `confirmada`; EventSpace `confirmado`; cliente pode ver confirmado; preparação recebe itens |
| **Prioridade** | MUST |

### FR-RESERVATION-005 — Recusar reserva

| Campo | Conteúdo |
|-------|----------|
| **Efeitos** | `recusada`; espaço liberado se estava pré-reservado |
| **Prioridade** | MUST |

### FR-RESERVATION-006 — Solicitar informações adicionais

| Campo | Conteúdo |
|-------|----------|
| **Status** | `aguardando_informacoes` |
| **Prioridade** | SHOULD |

### FR-RESERVATION-007 — Solicitar sinal (manual)

| Campo | Conteúdo |
|-------|----------|
| **Status** | `aguardando_sinal` |
| **Descrição** | Registro de valor/orientação; sem cobrança online no MVP |
| **Prioridade** | SHOULD |

### FR-RESERVATION-008 — Lista de espera

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |

### FR-RESERVATION-009 — Propor / alterar espaço

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |
| **Aceite** | Troca só se destino disponível; origem liberada atomicamente |

### FR-RESERVATION-010 — Cancelar (cliente)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Condição** | Permitido conforme política e status atual |

### FR-RESERVATION-011 — Cancelar (casa)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-RESERVATION-012 — Registrar chegada

| Campo | Conteúdo |
|-------|----------|
| **Ator** | P3 |
| **Status** | `cliente_chegou` (e espaço `ocupado` quando aplicável) |
| **Prioridade** | MUST |

### FR-RESERVATION-013 — No-show

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Efeitos** | Espaço pode voltar a política de reabertura (BR) |

### FR-RESERVATION-014 — Finalizar reserva

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-RESERVATION-015 — Expiração de pré-reserva / solicitação

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Solicitações não tratadas ou pré-reservas expiram conforme configuração. |
| **Prioridade** | MUST |
| **Aceite** | Ao expirar: status `expirada`; espaço disponível se aplicável |

### FR-RESERVATION-016 — Reserva criada pela administração

| Campo | Conteúdo |
|-------|----------|
| **Ator** | P2 |
| **Prioridade** | SHOULD |
| **Dados** | origin=admin; pode ir direto a confirmada conforme fluxo |

### FR-RESERVATION-017 — Observações internas

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Aceite** | Não visíveis no link público do cliente |

### FR-RESERVATION-018 — Idempotência de envio público

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Aceite** | Reenvio com mesma chave não cria segunda reserva |

### FR-RESERVATION-019 — Tipos de reserva e regras por tipo

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Aplicar capacidade, valor, consumação, sinal, itens, políticas por tipo. |
| **Prioridade** | MUST |
| **Regras** | Ver doc 08 |

### FR-RESERVATION-020 — Em atendimento

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | COULD / SHOULD leve |
| **Nota** | Pode ser omitido se `cliente_chegou` bastar no MVP |

---

## FR-GUEST — Convidados

### FR-GUEST-001 — Informar quantidade de pessoas

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Aceite** | Quantidade respeita min/max do espaço/evento |

### FR-GUEST-002 — Cadastrar lista de nomes (básico)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |
| **Dados** | nome; telefone opcional |

### FR-GUEST-003 — Unicidade telefone por evento

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Um telefone não deve gerar múltiplas solicitações ativas conflitantes conforme regra do venue. |
| **Prioridade** | SHOULD |
| **Nota** | Validar com estabelecimento (OQ) |

### FR-GUEST-004 — Link de convidados (aniversário)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD (MVP parcial) |

### FR-GUEST-005 — QR Code entrada

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | WON’T NOW |

---

## FR-BIRTHDAY — Aniversários

### FR-BIRTHDAY-001 — Fluxo de aniversário

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Cadastro do aniversariante, pacote, nome exibido, quantidade estimada, decoração/bolo se no pacote. |
| **Ator** | P5/P6 |
| **Prioridade** | MUST |

### FR-BIRTHDAY-002 — Pacotes de aniversário no catálogo

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-BIRTHDAY-003 — Limite de convidados do pacote

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-BIRTHDAY-004 — Lista compartilhável

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |

### FR-BIRTHDAY-005 — Confirmação de presença (RSVP)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | COULD / evolução |

### FR-BIRTHDAY-006 — Check-in de convidados individual

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | WON’T NOW (MVP usa check-in da reserva) |

---

## FR-CATALOG — Cardápio, combos e adicionais

### FR-CATALOG-001 — Categorias e itens

| Campo | Conteúdo |
|-------|----------|
| **Dados** | nome, descrição, imagem, categoria, valor, disponibilidade, destaque, antecipado |
| **Prioridade** | MUST |

### FR-CATALOG-002 — Status ativo / inativo / esgotado

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-CATALOG-003 — Vincular itens a eventos

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-CATALOG-004 — Limite por evento

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |

### FR-CATALOG-005 — Incluir itens na reserva

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Aceite** | Itens confirmados alimentam preparação |

### FR-CATALOG-006 — Exibir no site e na página do evento

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-CATALOG-007 — Estoque completo

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | WON’T NOW |

---

## FR-PREPARATION — Preparação

### FR-PREPARATION-001 — Gerar itens de preparação a partir da reserva

| Campo | Conteúdo |
|-------|----------|
| **Quando** | Na confirmação (ou regra configurável) |
| **Prioridade** | MUST |

### FR-PREPARATION-002 — Visão por reserva

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-PREPARATION-003 — Visão consolidada por item

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |
| **Decisão** | DEC-PREP-001: ambas as visões |

### FR-PREPARATION-004 — Atualizar status de preparação

| Campo | Conteúdo |
|-------|----------|
| **Status** | pendente → em_preparacao → pronto → entregue; cancelado |
| **Ator** | P4 |
| **Prioridade** | MUST |

### FR-PREPARATION-005 — Cancelamento reverte/cancela preparação

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

---

## FR-ADMIN — Painel administrativo

### FR-ADMIN-001 — Visão de hoje

| Campo | Conteúdo |
|-------|----------|
| **Descrição** | Evento do dia, totais, pendências, chegadas, disponíveis, alertas — sem excesso de gráficos. |
| **Prioridade** | MUST |
| **Aceite** | Carrega ações operacionais prioritárias em uma tela |

### FR-ADMIN-002 — Ações rápidas na visão de hoje

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | MUST |

### FR-ADMIN-003 — Alertas operacionais

| Campo | Conteúdo |
|-------|----------|
| **Exemplos** | Pendências antigas; sinal atrasado; capacidade estourando |
| **Prioridade** | SHOULD |

---

## FR-AUDIT — Auditoria

### FR-AUDIT-001 — Histórico de status da reserva

| Campo | Conteúdo |
|-------|----------|
| **Dados** | from, to, actor, at, note |
| **Prioridade** | MUST |

### FR-AUDIT-002 — Audit log de ações críticas

| Campo | Conteúdo |
|-------|----------|
| **Exemplos** | confirmar, recusar, trocar espaço, acessar CPF, alterar preço publicado |
| **Prioridade** | MUST |

### FR-AUDIT-003 — Log de acesso a dado sensível

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | SHOULD |

---

## Matriz de prioridade (resumo)

| Prefixo | MUST (amostra) | WON’T NOW |
|---------|----------------|-----------|
| AUTH | 001–004 | — |
| VENUE | 001–004 | page builder |
| SPACE | 001–003, 005 | editor livre A |
| EVENT | 001–003, 005–006 | 007 recorrente |
| CALENDAR | 001–003 | — |
| PUBLIC | 001–004 | — |
| RESERVATION | núcleo 001–005, 010–015, 017–019 | pagamento online |
| GUEST | 001 | 005 QR |
| BIRTHDAY | 001–003 | 006 check-in individual |
| CATALOG | 001–003, 005–006 | 007 estoque |
| PREPARATION | 001–005 | — |
| ADMIN | 001–002 | dashboards pesados |
| AUDIT | 001–002 | — |

---

Próximos: [06_NON_FUNCTIONAL_REQUIREMENTS.md](06_NON_FUNCTIONAL_REQUIREMENTS.md), [08_BUSINESS_RULES.md](08_BUSINESS_RULES.md).
