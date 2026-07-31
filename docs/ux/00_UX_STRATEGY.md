# UX 00 — Estratégia de Experiência

**Produto:** Gestor Camarote  
**Fase:** Especificação de UX (pós Fase 0)  
**Papéis:** Product Designer · UX · PO · Requisitos  
**Escopo:** especificação — sem UI implementada, HTML, React ou CSS  

---

## 1. Objetivo desta fase

Transformar a documentação de produto em especificação de UX suficiente para:

1. prototipação visual (Figma ou equivalente);
2. handoff futuro para engenharia;
3. validação do script de demo com stakeholders;
4. manter rastreabilidade com FRs, BRs e ACs.

## 2. Princípio central

O produto **não deve parecer um ERP**.

| Contexto | Sensação desejada |
|----------|-------------------|
| **Mobile (noite)** | Ferramenta operacional rápida — “o que fazer agora?” |
| **Desktop (gestão)** | Sistema administrativo completo, mas enxuto — largura útil, não módulos infinitos |
| **Público** | Fluxo claro de solicitação; honestidade de status |

Prioridades de interface:

1. estado atual  
2. ação necessária  
3. poucos cliques  
4. boa leitura  
5. botões grandes (operações críticas)  
6. busca simples  
7. filtros objetivos  
8. prevenção de erro  
9. confirmação em ações críticas (com consequências explícitas)  

## 3. Decisões de produto aprovadas (entrada desta fase)

| # | Decisão |
|---|---------|
| 1 | Multi-tenant desde o início |
| 2 | Solicitação pública nunca nasce confirmada |
| 3 | Banco = fonte de verdade contra duplicidade |
| 4 | Site e painel = mesma fonte de dados |
| 5 | Mapa inicial configurado pela NTWS por estabelecimento |
| 6 | Grade simplificada como fallback no MVP |
| 7 | Visão de hoje = home administrativa |
| 8 | Preparação: por reserva + consolidada por item |
| 9 | Snapshot de nome e preço nos itens da reserva |
| 10 | Observações internas nunca ao cliente |
| 11 | Sem PDV, estoque completo, pagamento integrado obrigatório, WhatsApp API, IA, editor livre de planta, app nativo |
| 12 | Atualização operacional: polling ou SSE |
| 13 | R$ 229,90/mês = hipótese comercial de validação |

Questões do gastrobar = **hipóteses / validação** (ver `17_UX_OPEN_QUESTIONS.md`).

## 4. Problemas de UX a resolver

| Problema | Estratégia UX |
|----------|---------------|
| Confirmação falsa | Microcopy + status visual distintos em todo o funil público |
| Caos na noite | Home = Visão de hoje; mapa + lista; check-in em ≤2 toques |
| Menu tipo ERP | Navegação curta; agrupamento “Gestão”; Aniversários/Clientes enxutos |
| Mapa impreciso no mobile | Mapa + lista alternativa + bottom sheet |
| Dados sensíveis na porta | Mascaramento + revelar sob ação |
| Concorrência de espaço | Mensagens humanas de conflito; sem culpar o usuário |
| Atualização multi-operador | Indicador de frescor; refresh; polling/SSE invisível quando saudável |

## 5. Pilares de experiência

### P1 — Honestidade de status
“Solicitação enviada” ≠ “Reserva confirmada”. Linguagem fixa no wizard, toast e página de status.

### P2 — Operação da noite
Recepção e preparação: alvos ≥44px, contraste, busca sticky, poucas telas.

### P3 — Uma fonte, muitos canais
Admin edita uma vez → site/calendário/reserva/preparação refletem (com snapshot onde aplicável).

### P4 — Prevenção > recuperação
Confirmações críticas listam consequências (libera espaço, cancela prep).

### P5 — Progressive disclosure
Wizard público passo a passo; admin mostra detalhe sob demanda.

## 6. Relação com `docs/12_UX_GUIDELINES.md`

Este pacote `docs/ux/*` **detalha e operacionaliza** as diretrizes do doc 12. Em conflito de detalhe, prevalece a especificação em `docs/ux/` + decisões aprovadas; conflitos abertos vão para `17_UX_OPEN_QUESTIONS.md`.

## 7. Escopo de entregáveis UX

| Entrega | Status nesta fase |
|---------|-------------------|
| Estratégia, IA, inventário, fluxos | Sim (texto) |
| Wireframes textuais MUST | Sim |
| Script de protótipo/demo | Sim |
| Rastreabilidade FR/BR/AC | Sim |
| Protótipo visual Figma | Não (próxima autorização) |
| Design system tokens / código | Não |

## 8. Critérios de qualidade da especificação

- Toda tela MUST tem wireframe textual.  
- Toda ação crítica tem diálogo de consequências.  
- Todo fluxo público reforça honestidade de status.  
- Mobile e desktop especificados onde diverge.  
- Hipóteses do gastrobar marcadas explicitamente.  

## 9. Fora desta especificação

Implementação, arquitetura executável, escolha de framework, tokens CSS finais, ilustrações finais de marca do venue (exceto placeholders da demo).
