# 12 — Diretrizes de UX

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Escopo:** diretrizes de produto/UX — sem implementação de UI  

---

## 1. Princípios de interface

1. **Mobile-first** em fluxos públicos e operacionais noturnos.  
2. **Simplicidade extrema** — parecer ferramenta de operação, não ERP.  
3. **Poucos cliques** para: confirmar, recusar, check-in, abrir espaço no mapa.  
4. **Uma pergunta por tela** no fluxo público quando possível.  
5. **Status honestos** — nunca “sucesso de reserva” antes da confirmação da casa.  
6. **Mapa e Visão de hoje** são âncoras do admin.  
7. **Legibilidade noturna** — contraste, fonte legível, alvos grandes.  
8. **Uma fonte de verdade** — o que o admin publica é o que o público vê.  
9. **Progressive disclosure** — avançado escondido (políticas longas, histórico).  
10. **Acessibilidade básica** — não depender só de cor no mapa.

---

## 2. Arquitetura de informação

### 2.1 Público
- Home do venue  
- Calendário  
- Evento  
- Fluxo de solicitação (wizard)  
- Página de status  

### 2.2 Admin
- **Visão de hoje** (home)  
- Fila de solicitações  
- Mapa do evento  
- Preparação  
- Eventos  
- Espaços  
- Catálogo  
- Página pública (settings)  
- Equipe  

Evitar menu com dezenas de módulos no MVP.

---

## 3. Visão de hoje — conteúdo priorizado

Incluir (ações > gráficos):

| Bloco | Prioridade |
|-------|------------|
| Evento do dia (ou “sem evento”) | MUST |
| Solicitações pendentes (count + CTA) | MUST |
| Aguardando sinal | SHOULD |
| Reservas confirmadas / pessoas esperadas | MUST |
| Camarotes / mesas confirmados | MUST |
| Aniversários do dia | SHOULD |
| Preparações pendentes | MUST |
| Chegaram / no-shows | MUST |
| Espaços ainda disponíveis | MUST |
| Alertas (TTL, conflitos evitados, etc.) | SHOULD |

**Não** priorizar: funis fancy, heatmaps, BI.

---

## 4. Mapa visual — UX

### Recomendação MVP
Template NTWS + estados por cor **e** rótulo textual.

| Status | Padrão visual (conceitual) |
|--------|----------------------------|
| disponível | neutro claro + “Livre” |
| pré-reservado | âmbar + “Pré” |
| confirmado | verde + “OK” |
| ocupado | azul escuro + “No local” |
| bloqueado | cinza + “Bloq” |
| indisponível | oculto ou hatched |

**Interação:** tap → painel lateral/bottom sheet com detalhes e ações.

**Não no MVP:** editor livre estilo Figma; drag de mesas pelo cliente final.

---

## 5. Fluxo público — tom e microcopy

| Situação | Tom |
|----------|-----|
| Envio | “Solicitação enviada. A casa vai analisar e você acompanhará o status.” |
| Confirmada | “Sua reserva foi confirmada pela casa.” |
| Recusada | Neutro, sem culpar o usuário; CTA ver outros espaços se houver |
| Expirada | Explicar que precisa enviar de novo |

Evitar urgência falsa e gamificação.

---

## 6. Formulários — dados pessoais

- Pedir CPF **somente** quando a regra financeira exigir; explicar “para controle da reserva”, nunca “para verificar identidade”.  
- Telefone com máscara BR.  
- Evitar campos “só porque sim”.  
- Erros inline objetivos.

---

## 7. Operação na porta

- Busca sticky.  
- Resultado com espaço em destaque.  
- Botão “Chegou” dominante.  
- Dados sensíveis mascarados até “mostrar”.  
- Modo “uma mão” / polegar.

---

## 8. Preparação

- Toggle: **Por item** | **Por reserva**.  
- Filtros: pendente / em prep / pronto.  
- Evitar tabelas densas estilo ERP; cards/listas escaneáveis.

---

## 9. Branding público

- Logo + cores do venue.  
- Tipografia do produto pode ser do design system NTWS, desde que legível.  
- Sem page builder; templates limitados.  
- Hero do evento: imagem do evento + CTA único principal.

Alinhar com regras de design do time quando houver implementação — preservar identidade do venue, não “SaaS genérico roxo”.

---

## 10. Estados vazios e erro

- Sem eventos: CTA criar evento (admin) / “Em breve” (público).  
- Sem pendências: mensagem positiva curta.  
- Conflito de espaço: “Esse espaço acabou de ser reservado. Escolha outro.”  
- Offline/poll fail: banner “pode estar desatualizado” + retry.

---

## 11. Motion (quando houver UI)

- 2–3 motion sutis: transição do wizard; highlight no mapa ao atualizar status; feedback do check-in.  
- Sem animações que atrasem ação noturna.

---

## 12. Critérios de qualidade UX (observáveis)

| ID | Critério |
|----|----------|
| UX-Q-01 | Fluxo público feliz ≤ 8 telas/passos principais |
| UX-Q-02 | Confirmar reserva na fila ≤ 2 toques após abrir detalhe |
| UX-Q-03 | Check-in a partir do mapa ≤ 2 toques |
| UX-Q-04 | Palavra “confirmada” não aparece antes do status confirmada |
| UX-Q-05 | Mapa distingue ≥ 4 estados sem depender só de cor |

---

## 13. Entregáveis de UX na próxima fase (não agora)

Wireframes, protótipo navegável, design system tokens, handoff — **somente após aprovação desta documentação**.
