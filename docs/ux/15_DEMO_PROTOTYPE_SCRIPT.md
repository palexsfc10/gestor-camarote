# UX 15 — Script de Protótipo / Demonstração UX

**Produto:** Gestor Camarote  
**Duração alvo:** 6–10 minutos  
**Objetivo:** validar narrativa e telas MUST antes/durante prototipação visual  

Alinhado a `docs/19_DEMO_SCRIPT.md`, com foco em **telas, mensagens e benefício por etapa**.

---

## 1. Dados fictícios da demo

| Campo | Valor |
|-------|-------|
| Venue | Gastrobar Aurora (fictício) |
| Evento | Sexta Live — Banda Norte |
| Data | Sex 08/08 · 22h–04h |
| Camarotes | 01–08 |
| Pré-confirmados | 01, 02, 05 |
| Livres | 03, 04, 06, 07, 08 |
| Cliente | Mariana Alves |
| Telefone | (11) 98888-0007 |
| Pessoas | 5 |
| Convidados | Mari, João, Ana, Pedro, Lia |
| Espaço escolhido | Camarote 07 |
| Itens | 2× Balde Heineken (R$ 99); 1× Pacote Neon (R$ 350) |
| Aniversariante exibido | Mari |

---

## 2. Sequência

### Etapa 1 — Casa cria/publica o evento (45–60s)

| | |
|--|--|
| **Telas** | ADM-10 → ADM-11 → PUB-02/03 |
| **Ações** | Revisar evento (ou publicar) · copiar link |
| **Mensagens** | “Evento publicado no site.” |
| **Benefício** | Uma fonte de verdade; calendário/site atualizados |

### Etapa 2 — Evento no calendário e site (20s)

| | |
|--|--|
| **Telas** | PUB-01, PUB-02, PUB-03 |
| **Benefício** | Divulgação pronta para Instagram/WhatsApp |

### Etapa 3 — Cliente acessa o link (15s)

| | |
|--|--|
| **Telas** | PUB-03 mobile |
| **Mensagem na UI** | CTA “Quero reservar” |

### Etapa 4 — Escolhe Camarote 07 (30s)

| | |
|--|--|
| **Telas** | PUB-04 → PUB-05 |
| **Dados** | Experiência Camarote · espaço 07 Livre |
| **Benefício** | Disponibilidade clara |

### Etapa 5 — Dados e cinco convidados (60s)

| | |
|--|--|
| **Telas** | PUB-06 → PUB-07 |
| **Mensagem persistente** | Solicitação ≠ confirmação |
| **Benefício** | Dados estruturados vs WhatsApp |

### Etapa 6 — Bebidas + pacote aniversário (45s)

| | |
|--|--|
| **Telas** | PUB-08 |
| **Benefício** | Adicionais já na solicitação → preparação depois |

### Etapa 7 — Envia solicitação (30s)

| | |
|--|--|
| **Telas** | PUB-09 → PUB-10 |
| **Mensagem** | “Solicitação enviada. Aguarde a análise da casa.” |
| **Status** | Aguardando a casa (`solicitada`) |
| **Benefício** | Expectativa correta |

### Etapa 8 — Painel recebe (30s)

| | |
|--|--|
| **Telas** | ADM-01 → ADM-02 → ADM-03 |
| **UI** | Pendências +1 · card Mariana · C07 |
| **Benefício** | Fila única |

### Etapa 9 — Admin confirma (30s)

| | |
|--|--|
| **Telas** | ADM-03 → ADM-04 modal |
| **Mensagem modal** | Espaço confirmado · cliente vê confirmada · itens na prep |
| **Toast** | “Reserva confirmada.” |
| **Benefício** | Decisão em poucos toques |

### Etapa 10 — Mapa atualiza (30s)

| | |
|--|--|
| **Telas** | ADM-05 |
| **UI** | C07 = OK; 01/02/05 OK; outros Livre |
| **Benefício** | Fim da reserva duplicada (narrar garantia) |

### Etapa 11 — Preparação (30s)

| | |
|--|--|
| **Telas** | ADM-07 (item) e/ou ADM-06 |
| **UI** | Balde ×2 + Pacote Neon sob C07 |
| **Benefício** | Equipe sabe o que montar |

### Etapa 12 — Chegada (30s)

| | |
|--|--|
| **Telas** | ADM-05 bottom sheet · check-in |
| **Mensagem** | “Chegada registrada.” |
| **UI** | C07 = Local |
| **Benefício** | Porta rápida |

### Fecho (30s)

Narrar hipótese R$ 229,90/mês · perguntar disposição · reforçar o que não é (PDV).

---

## 3. Checklist do protótipo visual

- [ ] Honestidade de status no wizard e PUB-10  
- [ ] Modal de consequências na confirmação  
- [ ] Mapa com legenda + lista mobile  
- [ ] Prep com toggle A/B  
- [ ] Mascaramento de telefone  
- [ ] Bottom nav admin  
- [ ] Empty “sem evento hoje” (tela extra opcional)  

---

## 4. Duração por bloco

| Bloco | Tempo |
|-------|-------|
| Publique + site | ~1,5 min |
| Funil cliente | ~3 min |
| Admin + mapa + prep + chegada | ~3–4 min |
| Fecho | ~0,5 min |
