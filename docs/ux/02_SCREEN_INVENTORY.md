# UX 02 — Inventário de Telas

**Produto:** Gestor Camarote  
**Fase:** Especificação de UX  
**Prioridade:** MUST | SHOULD | COULD | WON’T NOW  

---

## Convenções

- **ID:** `PUB-*` público · `ADM-*` admin · `GUEST-*` convidado · `AUTH-*` autenticação  
- Wireframes textuais detalhados nas specs de fluxo (docs 03–10) para telas MUST  
- Rotas = conceituais  

---

## 1. Autenticação

### AUTH-01 — Login admin

| Campo | Valor |
|-------|-------|
| **Nome** | Login |
| **Rota** | `/admin/login` |
| **Persona** | P1–P4 |
| **Objetivo** | Autenticar no painel do venue |
| **Componentes** | Logo, email, senha, CTA Entrar, link recuperar (SHOULD) |
| **Dados** | email, senha |
| **Ação principal** | Entrar |
| **Secundárias** | Recuperar senha |
| **Estados** | loading, erro credencial, tenant suspenso |
| **Permissões** | público admin |
| **FRs** | FR-AUTH-001, 004 |
| **ACs** | — |
| **MVP** | MUST |

### AUTH-02 — Sessão expirada (modal/página)

| Campo | Valor |
|-------|-------|
| **MVP** | MUST |
| **FRs** | FR-AUTH-004 |
| **Objetivo** | Reautenticar sem perder contexto quando possível |

---

## 2. Telas públicas

### PUB-01 — Home do estabelecimento

| Campo | Valor |
|-------|-------|
| **Rota** | `/{venueSlug}` |
| **Persona** | Público / P5 |
| **Objetivo** | Apresentar a casa e próximos eventos |
| **Componentes** | Header branding, hero/imagem, próximos eventos, localização, contato, redes, destaques catálogo |
| **Dados** | PublicPageSettings, eventos publicados, contatos |
| **Principal** | Abrir evento / Ver calendário |
| **Estados** | vazio (sem eventos), loading |
| **FRs** | FR-PUBLIC-SITE-001, FR-VENUE-003 |
| **MVP** | MUST |

### PUB-02 — Calendário público

| Campo | Valor |
|-------|-------|
| **Rota** | `/{venueSlug}/calendario` |
| **Objetivo** | Explorar eventos no tempo |
| **Componentes** | Mês/lista, chips Hoje/Semana/Próximos, cards de evento (esgotado/cancelado) |
| **Principal** | Abrir evento |
| **FRs** | FR-CALENDAR-001..003 |
| **ACs** | AC-EVT-001 |
| **MVP** | MUST |

### PUB-03 — Página do evento

| Campo | Valor |
|-------|-------|
| **Rota** | `/{venueSlug}/eventos/{eventSlug}` |
| **Objetivo** | Informar e iniciar solicitação |
| **Componentes** | Título, status, data/hora, imagem, atração, regras, disponibilidade resumida, CTA Reservar, itens/combos |
| **Principal** | Quero reservar |
| **Secundárias** | Ver cardápio do evento, compartilhar (nativo) |
| **Estados** | disponível, esgotado, cancelado, encerrado, loading |
| **FRs** | FR-PUBLIC-SITE-002..004 |
| **MVP** | MUST |

### PUB-04 — Wizard: escolha da experiência

| Campo | Valor |
|-------|-------|
| **Rota** | `.../reservar/experiencia` |
| **Objetivo** | Escolher modalidade |
| **Componentes** | Progresso, cards Camarote/Mesa/Aniversário/(outras), Voltar |
| **Principal** | Selecionar experiência |
| **FRs** | FR-RESERVATION-001, 019 |
| **MVP** | MUST |

### PUB-05 — Wizard: escolha do espaço

| Campo | Valor |
|-------|-------|
| **Rota** | `.../reservar/espaco` |
| **Objetivo** | Escolher espaço disponível |
| **Componentes** | Lista/cards de espaços, capacidade, valor, status; opcional mini-mapa só leitura |
| **Principal** | Selecionar espaço |
| **Estados** | livre, indisponível mid-flow, esgotado total |
| **FRs** | FR-RESERVATION-001..002; FR-SPACE-* |
| **ACs** | AC-RES-CONCURRENCY (efeito), AC-SPACE-001 |
| **MVP** | MUST |

### PUB-06 — Wizard: dados do responsável

| Campo | Valor |
|-------|-------|
| **Rota** | `.../reservar/dados` |
| **Componentes** | Nome*, telefone*, e-mail?, CPF?, qtd pessoas*, horário?, tipo comemoração?, obs públicas? |
| **Principal** | Continuar |
| **Notas** | CPF condicional (hipótese venue); texto “não é confirmação” no rodapé do wizard |
| **FRs** | FR-RESERVATION-001; BR-CPF-*; BR-RES-011..013 |
| **MVP** | MUST |

### PUB-07 — Wizard: convidados

| Campo | Valor |
|-------|-------|
| **Rota** | `.../reservar/convidados` |
| **Componentes** | Lista de nomes (até partySize ou limite), adicionar/remover; skip se mesa simples (SHOULD skip) |
| **Principal** | Continuar |
| **FRs** | FR-GUEST-001..002 |
| **MVP** | SHOULD (MUST na demo camarote/aniversário) |

### PUB-08 — Wizard: adicionais

| Campo | Valor |
|-------|-------|
| **Rota** | `.../reservar/adicionais` |
| **Componentes** | Categorias, cards item (nome, preço, imagem), qty stepper; esgotado disabled |
| **Principal** | Continuar |
| **FRs** | FR-CATALOG-005; BR-CAT-*; DEC-SNAP |
| **MVP** | MUST |

### PUB-09 — Wizard: revisão e envio

| Campo | Valor |
|-------|-------|
| **Rota** | `.../reservar/revisao` |
| **Componentes** | Resumo completo, aviso “aguardando aprovação da casa”, checkbox privacidade, CTA Enviar solicitação |
| **Principal** | Enviar solicitação |
| **Estados** | submitting, erro validação, conflito espaço, rate limit, sucesso→redirect status |
| **FRs** | FR-RESERVATION-001, 018; NFR-IDEM; NFR-SEC-005/006 |
| **ACs** | AC-RES-001, 005; AC-ABUSE-001 |
| **MVP** | MUST |

### PUB-10 — Acompanhamento de status

| Campo | Valor |
|-------|-------|
| **Rota** | `/s/{token}` |
| **Objetivo** | Ver status honesto; instruções (sinal) |
| **Componentes** | Status hero, resumo, timeline simples, CTA cancelar (se permitido), sem obs internas |
| **Estados** | solicitada, aguardando_*, confirmada, recusada, cancelada, expirada, lista_espera, chegou, finalizada |
| **FRs** | FR-AUTH-003; DEC-NOTES-001 |
| **ACs** | AC-AUTH-003; AC-RES-002 (pós-confirmação) |
| **MVP** | MUST |

### PUB-11 — Convidado: entrar na lista

| Campo | Valor |
|-------|-------|
| **Rota** | `/g/{token}` |
| **MVP** | SHOULD |
| **FRs** | FR-GUEST-004; FR-BIRTHDAY-004 |
| **Estados** | lista cheia, link inválido, sucesso |

---

## 3. Telas administrativas — operação

### ADM-01 — Visão de hoje

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/hoje` |
| **Persona** | P1–P4 |
| **Objetivo** | Priorizar ações do dia |
| **Componentes** | Seletor evento, cards métricas acionáveis, alertas, CTAs |
| **Principal** | Abrir pendências |
| **FRs** | FR-ADMIN-001..003 |
| **ACs** | AC-TODAY-001 |
| **MVP** | MUST |

### ADM-02 — Fila / lista de reservas

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/reservas` |
| **Componentes** | Busca, filtros status/tipo/evento, lista cards, badge novos |
| **Principal** | Abrir reserva |
| **Secundárias** | Nova reserva admin |
| **FRs** | FR-RESERVATION-003 |
| **MVP** | MUST |

### ADM-03 — Detalhe da reserva

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/reservas/:id` |
| **Componentes** | Header status, dados, espaço, itens (snapshot), prep resumo, obs internas, histórico, ações |
| **Principal** | Confirmar (contexto) |
| **Secundárias** | Recusar, sinal, troca espaço, cancelar, check-in, no-show |
| **FRs** | FR-RESERVATION-004..017; FR-AUDIT-001 |
| **ACs** | AC-RES-002..007; AC-PRIV-001 |
| **MVP** | MUST |

### ADM-04 — Diálogos de confirmação crítica

| Campo | Valor |
|-------|-------|
| **Tipo** | Modal reutilizável |
| **Objetivo** | Exibir consequências antes de confirmar/recusar/cancelar/no-show |
| **MVP** | MUST |
| **Exemplo** | “Cancelar liberará o camarote 07 e cancelará itens de preparação pendentes.” |

### ADM-05 — Mapa da casa

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/mapa` |
| **Componentes** | Template/grade, legenda, toggle lista, bottom sheet/drawer detalhe |
| **Principal** | Selecionar espaço |
| **FRs** | FR-SPACE-005 |
| **ACs** | AC-MAP-001 |
| **MVP** | MUST |

### ADM-06 — Preparação (visão por reserva)

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/preparacao?view=reserva` |
| **FRs** | FR-PREPARATION-002, 004 |
| **ACs** | AC-PREP-001, 002 |
| **MVP** | MUST |

### ADM-07 — Preparação (visão consolidada)

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/preparacao?view=item` |
| **FRs** | FR-PREPARATION-003 |
| **MVP** | MUST |

### ADM-08 — Check-in rápido (pode ser modo do mapa/detalhe)

| Campo | Valor |
|-------|-------|
| **Objetivo** | Registrar chegada em ≤2 toques |
| **MVP** | MUST (padrão de interação; não necessariamente rota isolada) |
| **ACs** | AC-CLI-001 |

---

## 4. Telas administrativas — eventos e calendário

### ADM-09 — Lista / calendário de eventos

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/eventos` |
| **Componentes** | Toggle lista\|calendário, filtros status, CTA Novo |
| **MVP** | MUST |
| **FRs** | FR-EVENT-*; FR-CALENDAR (admin view) |

### ADM-10 — Wizard criar/editar evento

| Campo | Valor |
|-------|-------|
| **Rota** | `/admin/eventos/novo` · `.../:id` |
| **Passos** | Dados → Espaços → Catálogo → Revisar → Publicar |
| **MVP** | MUST |
| **FRs** | FR-EVENT-001..006 |
| **ACs** | AC-EVT-001, 002 |

### ADM-11 — Detalhe evento (pós-criação)

| Campo | Valor |
|-------|-------|
| **Componentes** | Status, link público, ocupação, atalhos mapa/reservas, ações publicar/cancelar |
| **MVP** | MUST |

---

## 5. Catálogo, site, clientes, config

### ADM-12 — Lista cardápio

| **MVP** | MUST | **FRs** | FR-CATALOG-001..006 |

### ADM-13 — Form item catálogo

| **MVP** | MUST | Snapshot afeta só novas reservas |

### ADM-14 — Site / branding

| **MVP** | MUST | **FRs** | FR-VENUE-003; FR-PUBLIC-SITE-003 | Preview |

### ADM-15 — Clientes (busca leve)

| **MVP** | SHOULD | Não CRM |

### ADM-16 — Configurações venue

| **MVP** | MUST |

### ADM-17 — Config espaços

| **MVP** | MUST | Template mapa = NTWS |

### ADM-18 — Config equipe

| **MVP** | MUST | **FRs** | FR-VENUE-002; FR-AUTH-002 |

### ADM-19 — Aniversários (filtro/visão)

| **MVP** | SHOULD UI dedicada; MUST via filtro reservas | **FRs** | FR-BIRTHDAY-* |

---

## 6. Matriz MUST (resumo para prototipação)

| ID | Nome | Superfície |
|----|------|------------|
| AUTH-01 | Login | Admin |
| PUB-01 | Home venue | Público |
| PUB-02 | Calendário | Público |
| PUB-03 | Página evento | Público |
| PUB-04–09 | Wizard solicitação | Público |
| PUB-10 | Status | Público |
| ADM-01 | Visão de hoje | Admin |
| ADM-02 | Lista reservas | Admin |
| ADM-03 | Detalhe reserva | Admin |
| ADM-04 | Modais críticos | Admin |
| ADM-05 | Mapa | Admin |
| ADM-06–07 | Preparação A/B | Admin |
| ADM-09–11 | Eventos | Admin |
| ADM-12–13 | Cardápio | Admin |
| ADM-14 | Site | Admin |
| ADM-16–18 | Config | Admin |

**SHOULD:** PUB-11, ADM-15, ADM-19 dedicado, recuperar senha.

**WON’T NOW:** editor planta, QR individual, page builder, app nativo, telas de gateway.
