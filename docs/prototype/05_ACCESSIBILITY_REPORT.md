# Prototype 05 — Relatório de Acessibilidade

## Implementado no protótipo

- `lang="pt-BR"`  
- Landmarks / headings  
- Foco visível global (`:focus-visible`)  
- Labels em formulários  
- Erros com `role="alert"`  
- Status com **texto** (badges), não só cor  
- Mapa SVG com `aria-label` + **lista alternativa**  
- Dialogs Radix com título/descrição  
- `aria-live` no toast  
- Alvos de toque ≥ ~44px (botões `min-h-11`)  
- Progresso do wizard anunciável em texto  

## Limitações

- Retângulos SVG: foco por teclado limitado (lista cobre a ação)  
- Sem auditoria axe automatizada no CI  
- Contraste validado visualmente, não com scanner formal  

## Veredicto A11y do protótipo

**Adequado para demo** com ressalvas; reforçar na fase de produto.
