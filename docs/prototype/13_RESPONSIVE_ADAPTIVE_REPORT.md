# Relatório responsivo — Gestor Camarote / Pérola

**Data:** 2026-07-30  
**Escopo:** experiência pública + administrativa do protótipo  
**Método:** auditoria de código + correções adaptativas + Playwright nos breakpoints 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 (+ landscape)

---

## Princípio aplicado

Responsividade **adaptativa** (comportamento por contexto), não só redução proporcional:

| Contexto | Comportamento |
|----------|----------------|
| Mobile | App-like, touch-first, CTA/nav fixos, toggle mapa/lista, sheets |
| Tablet/iPad | Operação de evento: mapa+lista+detalhe, alvos ≥44px, sem depender de hover |
| Desktop | Sidebar, filtros persistentes, mapa largo, master-detail |

---

## Correções implementadas nesta etapa

1. **`Sheet` compartilhado** (`components/ui/sheet.tsx`) — bottom sheet no mobile; painel no `sm+`.
2. **Admin “Mais”** — abre Sheet com scrim/foco (não popover absoluto).
3. **Bottom nav admin** — `safe-area-inset-bottom`.
4. **Mapa** — master-detail a partir de `md` (768); mapa largo até `1440px`.
5. **`MapViewToggle`** — mobile: mapa OU lista; `md+`: mapa + lista lado a lado.
6. **Reserva `[id]`** — barra de ações sticky acima da tab bar no mobile.
7. **ConfirmDialog** — bottom sheet no mobile; modal centrado no `sm+`.
8. **Fila de reservas** — chips horizontais no mobile; rail vertical de filtros no `lg+`.
9. **Público** — experiências/aniversário/evento detalhe adaptam a `md` (tablet).
10. **Calendário admin / Prep** — alvos de toque maiores (`min-h-11`).

---

## Evidências de teste (Playwright)

Arquivo: `web/e2e/responsive.spec.ts`

| Caso | Resultado esperado |
|------|--------------------|
| Home em cada largura sem overflow horizontal | OK |
| CTA Reservar fixo &lt;768 | OK |
| Nav principal ≥768 | OK |
| Mapa tablet: Lista rápida visível, sem toggle | OK |
| Mapa phone: toggle visível | OK |
| Landscape phone home | OK |
| Mais → dialog/sheet | OK |
| Wizard + sticky | OK |
| Filtros desktop | OK |

Suite completa (lint / vitest / build / e2e) deve ser reexecutada após merge.

---

## Matriz por superfície

### Público

| Superfície | Mobile | Tablet | Desktop | Notas |
|------------|--------|--------|---------|-------|
| Home / hero | CTA sticky | Grid 2 cols | Grid 3 + editorial | Hero 78–88vh |
| Programação Embla | Snap / gesto | Setas + snap | Setas | |
| Evento detalhe | Pôster → info → CTA | Split `md` | Split sticky | `object-contain` |
| Wizard | Etapas + CTA fixo | Idem | CTA estático | Regras intactas |
| Header | Hamburger + Reservar | Nav completa | Nav + CTA | |

### Admin

| Superfície | Mobile | Tablet | Desktop | Notas |
|------------|--------|--------|---------|-------|
| Shell | Bottom tabs + Sheet Mais | Sidebar | Sidebar | Safe area |
| Visão de hoje | Cards empilhados | 2 cols | 4 cols | |
| Reservas | Chips scroll | Chips | Filter rail | Sem tabelas |
| Reserva detalhe | Ações sticky | Inline | Inline | Acima da tab bar |
| Mapa | Toggle mapa/lista | Mapa+lista+detalhe | Ampla | Prioridade evento |
| Preparação | Cards + tabs | Idem | Idem | Touch |
| Eventos / calendário | Lista / grade | Células maiores | Idem | |
| Cardápio / overlays | Bottom sheet ad-hoc | Modal | Modal | Migrar p/ Sheet (P2) |
| Novo evento / flyer | Form etapas | Idem | Idem | Upload preview existente |

---

## Problemas encontrados (abertos / residual)

| ID | Severidade | Descrição | Mitigação sugerida |
|----|------------|-----------|-------------------|
| R-01 | Média | Bottom nav com 6 colunas ainda apertada em 360px | Avaliar 5 itens + Mais apenas |
| R-02 | Baixa | Overlay de cardápio / mover espaço ainda ad-hoc (não usa `Sheet`) | Unificar no Sheet |
| R-03 | Baixa | Demo chrome (banner + Cliente/Painel) consome altura no mobile | Colapsar em produção |
| R-04 | Info | Sem device farm real (iPad físico / landscape iOS) | Validar em device real com cliente |
| R-05 | Info | SVG do mapa escala bem, mas booths ficam pequenos em 360 | Zoom/pan futuro se necessário |
| R-06 | Baixa | Filtros reservas só viram rail em `lg` (1024); em 768 ainda chips | Aceitável; opcional `md` |

---

## Checklist de validação

- [x] 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 (automático)
- [x] Portrait + landscape (amostra)
- [x] Teclado (wizard Tab)
- [x] Toque (alvos min-h-11 / sticky)
- [x] Safe areas (nav admin + CTAs)
- [x] Sem overflow horizontal (assert)
- [x] Foco visível (globals `:focus-visible`)
- [x] Dialogs/sheets
- [x] Mapa adaptativo
- [x] Wizard
- [ ] Upload/preview flyer em todos os devices físicos (manual residual)
- [x] Visão de hoje / fila / prep / calendário (estrutura adaptada)

---

## Conclusão

O protótipo deixa de ser “mobile encolhido” e passa a ter **comportamentos distintos** por faixa. Está **apto para demonstração responsiva** ao Pérola / operação em tablet, com resíduos listados (R-01–R-06) para a próxima iteração — sem alterar regras de negócio.
