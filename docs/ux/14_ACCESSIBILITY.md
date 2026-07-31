# UX 14 — Acessibilidade

**Produto:** Gestor Camarote  
**Meta MVP:** WCAG 2.1 AA nos fluxos públicos principais; operação admin usável com teclado e leitores básicos  

---

## 1. Requisitos de UX (não implementação)

| ID | Requisito |
|----|-----------|
| A11Y-UX-01 | Status do mapa com texto/ícone, não só cor |
| A11Y-UX-02 | Contraste de texto e chips ≥ AA |
| A11Y-UX-03 | Todos os inputs com label visível |
| A11Y-UX-04 | Erros associados ao campo (texto, não só cor) |
| A11Y-UX-05 | Foco visível em controles interativos |
| A11Y-UX-06 | Ordem de foco lógica no wizard |
| A11Y-UX-07 | Modais: foco preso; Esc fecha (exceto bloqueantes de sessão) |
| A11Y-UX-08 | Botões com nome acessível (“Confirmar reserva”, não só “OK”) |
| A11Y-UX-09 | Lista alternativa ao mapa com mesma informação |
| A11Y-UX-10 | Anúncios de toast/status para leitores (polite) — especificar no handoff |
| A11Y-UX-11 | Não depender de hover para ações críticas |
| A11Y-UX-12 | Tamanho de toque ≥ 44px em mobile operacional |
| A11Y-UX-13 | Idioma pt-BR declarado |
| A11Y-UX-14 | Imagens de evento com texto alternativo (título do evento se decorativa de hero) |

---

## 2. Mapa e daltonismo

Legenda + rótulos curtos (Livre, Pré, Sinal, OK, Local, Bloq).  
Padrões/hatch para manutenção.  
Testar com simulação deuteranopia no protótipo visual.

---

## 3. Movimento

Respeitar `prefers-reduced-motion` no handoff (reduzir animações do mapa/wizard). Motion da estratégia: 2–3 sutis, não essenciais à compreensão.

---

## 4. Conteúdo sensível

Revelar CPF/telefone = botão explícito; estado “oculto/visível” anunciável.

---

## 5. Fora do MVP A11y

- Auditoria completa automatizada CI  
- Suporte a leitores de tela em canvas complexo do mapa (mitigado pela lista)  
- Localização i18n  

---

## 6. Critérios de aceite (amostra)

Given um espaço confirmado no mapa  
When o usuário de teclado tabula até o controle do Camarote 07  
Then o foco é visível  
And o nome acessível inclui status “confirmado”  
And a lista alternativa também permite a mesma ação de abrir detalhe.
