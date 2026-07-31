# UX 01 — Arquitetura de Informação

**Produto:** Gestor Camarote  
**Fase:** Especificação de UX  

---

## 1. Visão geral

Duas superfícies:

| Superfície | Objetivo | Navegação |
|------------|----------|-----------|
| **Pública** | Descobrir evento → solicitar → acompanhar | Linear / poucas rotas |
| **Administrativa** | Operar a noite + configurar a casa | Menu curto + home operacional |

Multi-tenant: após login, contexto = Venue atual (demo: um venue).

---

## 2. IA pública

```
/{venueSlug}                    Home do estabelecimento
/{venueSlug}/calendario         Calendário de eventos
/{venueSlug}/eventos/{eventSlug} Página do evento
/{venueSlug}/eventos/{eventSlug}/reservar/*  Wizard de solicitação
/s/{reservationPublicToken}     Acompanhamento de status
/g/{guestShareToken}            Lista de convidados (aniversário) — SHOULD
```

**Fluxo mental do cliente**

```
Link (IG/WA) → Evento → Experiência → Espaço → Dados → Convidados → Adicionais → Revisão → Envio → Status
```

Sem conta obrigatória no MVP público.

---

## 3. Menu administrativo proposto (lista completa)

Itens solicitados:

1. Visão de hoje  
2. Calendário  
3. Eventos  
4. Reservas  
5. Mapa da casa  
6. Aniversários  
7. Cardápio e combos  
8. Preparação  
9. Site  
10. Clientes  
11. Configurações  

### 3.1 Avaliação: todos no MVP?

Menu com 11 itens **parece ERP** e compete com o princípio de simplicidade.

| Item | MVP na nav primária? | Recomendação |
|------|----------------------|--------------|
| Visão de hoje | MUST | Home; sempre 1º |
| Reservas | MUST | Fila + lista + detalhe |
| Mapa da casa | MUST | Operação |
| Preparação | MUST | Operação |
| Eventos | MUST | Inclui criar/editar/publicar |
| Calendário | MUST mas **não item separado** | Aba/visão dentro de Eventos **ou** atalho na Visão de hoje |
| Cardápio e combos | MUST | Em grupo **Gestão** |
| Site | MUST | Em **Gestão** |
| Configurações | MUST | Espaços, equipe, venue, preferências |
| Aniversários | SHOULD como item | **Filtro/visão dentro de Reservas** + card na Visão de hoje; item de menu opcional se volume alto |
| Clientes | COULD / leve | Em **Gestão**; histórico mínimo — não CRM |

### 3.2 Navegação MVP recomendada

**Primária (sempre visível — 5 itens + Mais):**

1. Hoje  
2. Reservas  
3. Mapa  
4. Preparação  
5. Eventos  

**Grupo “Gestão” (drawer / Mais):**

6. Cardápio  
7. Site  
8. Clientes  
9. Configurações  

**Aniversários:** tab/filtro em Reservas (`tipo=aniversario`) + seção na Visão de hoje. Item de menu dedicado = **pós-MVP** ou ativado se o piloto exigir.

**Calendário:** view `mês | lista` em Eventos; deep-link `/admin/eventos?view=calendar`.

```
┌─────────────────────────────────────────────┐
│ [Logo venue]  Gestor Camarote    [User]     │
├─────────────────────────────────────────────┤
│ Hoje │ Reservas │ Mapa │ Prep. │ Eventos │⋯│
└─────────────────────────────────────────────┘
 ⋯ = Gestão: Cardápio | Site | Clientes | Config
```

Mobile: bottom nav com **Hoje | Reservas | Mapa | Prep. | Mais**.

---

## 4. Seções detalhadas

### 4.1 Visão de hoje

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Responder “O que está acontecendo hoje?” e apontar a próxima ação |
| **Usuário** | P1, P2, P3 (leitura), P4 (atalho prep) |
| **Tarefas** | Ver pendências, ir à fila, mapa, prep, chegadas |
| **Informações** | Evento ativo/próximo; counts; alertas |
| **Ações primárias** | Abrir pendências; confirmar atalho; ir ao mapa |
| **Ações secundárias** | Trocar evento do dia; copiar link público |
| **Atalhos** | Badge de pendências no nav |
| **Relação** | Alimenta Reservas, Mapa, Preparação, Eventos |

### 4.2 Calendário (visão de Eventos)

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Orientar-se no tempo; achar evento |
| **Usuário** | P1, P2 |
| **Tarefas** | Navegar mês; abrir evento; criar a partir do dia |
| **Informações** | Eventos por dia; status (publicado/rascunho/cancelado) |
| **Primária** | Abrir evento; Criar evento |
| **Secundária** | Duplicar (no detalhe) |
| **Relação** | Eventos; Site público espelha publicados |

### 4.3 Eventos

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Ciclo de vida do evento até publicação |
| **Usuário** | P1, P2 |
| **Tarefas** | Criar, editar, espaços, catálogo, publicar, cancelar, arquivar |
| **Informações** | Título, data, status, ocupação resumida |
| **Primária** | Publicar / Salvar |
| **Secundária** | Duplicar, despublicar, copiar link |
| **Relação** | Site, Reservas, Mapa, Catálogo |

### 4.4 Reservas

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Triar e gerir solicitações/reservas |
| **Usuário** | P2 (principal), P1, P3 (consulta/check-in) |
| **Tarefas** | Analisar, confirmar, recusar, sinal, troca espaço, cancelar, histórico |
| **Informações** | Fila, filtros de status/tipo, detalhe completo |
| **Primária** | Confirmar / Recusar |
| **Secundária** | Lista espera, editar dados, criar reserva admin |
| **Atalhos** | De Hoje (pendências); do Mapa (espaço) |
| **Relação** | Mapa, Prep, Aniversários (filtro), Clientes |

### 4.5 Mapa da casa

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Visão espacial do evento + ações contextuais |
| **Usuário** | P2, P3 |
| **Tarefas** | Selecionar espaço; check-in; bloqueio; abrir reserva |
| **Informações** | Status visual + rótulo; legenda; evento selecionado |
| **Primária** | Selecionar → ação (chegou / abrir reserva) |
| **Secundária** | Bloquear; lista alternativa |
| **Relação** | Reservas, Hoje, Check-in |

### 4.6 Aniversários

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Foco operacional em pacotes/aniversariantes do evento |
| **Usuário** | P2, P3 |
| **MVP** | Filtro em Reservas + cards em Hoje (não menu dedicado) |
| **Tarefas** | Ver pacote, lista convidados, status |
| **Evolução** | Menu dedicado se volume justificar |
| **Relação** | Reservas, Prep, fluxo público aniversário |

### 4.7 Cardápio e combos

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Manter catálogo único (site + reserva + prep) |
| **Usuário** | P1, P2 |
| **Tarefas** | CRUD item, preço, imagem, esgotado, destaque, vínculo evento |
| **Primária** | Salvar item |
| **Secundária** | Destacar no site; desativar |
| **Relação** | Site, Eventos, Reservas, Preparação |

### 4.8 Preparação

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Executar itens antecipados na noite |
| **Usuário** | P4, P2 |
| **Tarefas** | Alternar visão A/B; avançar status |
| **Primária** | Marcar em preparação / pronto / entregue |
| **Secundária** | Filtrar; abrir reserva |
| **Relação** | Reservas (snapshot), Hoje |

### 4.9 Site

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Branding leve + preview do que o público vê |
| **Usuário** | P1 |
| **Tarefas** | Logo, cores, imagens, contato, preview |
| **Primária** | Salvar / Publicar settings |
| **Secundária** | Abrir site em nova aba |
| **Relação** | PublicPageSettings; Eventos publicados |

### 4.10 Clientes

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Histórico leve (não CRM) |
| **Usuário** | P1, P2 |
| **Tarefas** | Buscar por nome/telefone; ver reservas anteriores do venue |
| **Primária** | Buscar / abrir histórico |
| **MVP** | Lista simples; mascaramento |
| **Relação** | Reservas |

### 4.11 Configurações

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Venue, espaços, equipe, preferências (TTL, CPF — hipóteses) |
| **Usuário** | P1; NTWS implantação (mapa template) |
| **Tarefas** | Editar venue; espaços; usuários; preferências |
| **Primária** | Salvar |
| **Nota** | Template do mapa = configuração NTWS, não self-service livre no MVP |
| **Relação** | Tudo |

---

## 5. Mapa de permissões × seções (MVP)

| Seção | Gestor | Reservas | Recepção | Preparação |
|-------|--------|----------|----------|------------|
| Hoje | ✓ | ✓ | ✓ leitura+check-in | ✓ atalho prep |
| Reservas | ✓ | ✓ | ✓ limitado | leitura itens |
| Mapa | ✓ | ✓ | ✓ | leitura |
| Preparação | ✓ | ✓ | — | ✓ |
| Eventos | ✓ | ✓ parcial | — | — |
| Cardápio | ✓ | ✓ | — | — |
| Site | ✓ | — | — | — |
| Clientes | ✓ | ✓ | — | — |
| Config | ✓ | — | — | — |

---

## 6. Princípios de agrupamento

1. **Operação** (noite) ≠ **Gestão** (diurno).  
2. Calendário não compete com Hoje na bottom nav.  
3. Aniversários são tipo de reserva, não produto paralelo no MVP.  
4. Clientes nunca no centro da operação noturna.  

---

## 7. Rotas conceituais admin

```
/admin                          → redirect Visão de hoje
/admin/hoje
/admin/reservas
/admin/reservas/:id
/admin/mapa?eventId=
/admin/preparacao?eventId=&view=reserva|item
/admin/eventos
/admin/eventos/novo
/admin/eventos/:id
/admin/eventos?view=calendar
/admin/cardapio
/admin/cardapio/:itemId
/admin/site
/admin/clientes
/admin/configuracoes
/admin/configuracoes/espacos
/admin/configuracoes/equipe
```
