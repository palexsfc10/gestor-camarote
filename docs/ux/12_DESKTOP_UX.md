# UX 12 — Desktop UX

**Produto:** Gestor Camarote  
**Escopo:** gestão diurna + operação com tela grande  

---

## 1. Princípios desktop

1. Usar largura: painéis lado a lado sem parecer ERP lotado.  
2. Mapa maior com drawer de detalhe.  
3. Filtros persistentes em coluna ou barra sticky.  
4. Mais informação densificada com hierarquia clara.  
5. Atalhos de teclado = COULD (não MUST).  
6. Operação em lote **somente** quando segura — MVP: **sem lote** de confirmar/cancelar.  
7. Top nav com labels textuais (não só ícones).  

---

## 2. Layout shell

```
┌─ Top bar: venue · user · logout ───────────────┐
│ Nav: Hoje Reservas Mapa Prep Eventos | Gestão⋯ │
├────────────────────────────────────────────────┤
│                                                │
│              Conteúdo                          │
│                                                │
└────────────────────────────────────────────────┘
```

Largura útil max ~1280–1440 para formulários; mapa pode full bleed interno.

---

## 3. Padrões por área

### Visão de hoje
Grid de cards 3–4 colunas; alertas full width no topo.

### Reservas
Lista (40%) + detalhe (60%) em telas ≥1200px (master-detail).  
&lt;1200px: navegação por página como mobile.

### Mapa
Canvas + drawer direito ≥360px. Legenda flutuante ou rodapé.

### Preparação
Master-detail: lista reservas/itens | painel ações.

### Eventos / Cardápio
Formulários em duas colunas quando labels curtos; uploads à direita.

### Site
Form + preview lado a lado.

---

## 4. Densidade

- Operação (mapa, prep, fila): densidade média, botões grandes ainda.  
- Configuração: densidade um pouco maior aceitável.  
- Nunca “Excel embutido”.  

---

## 5. Hover e foco

- Hover pode realçar espaço no mapa.  
- Foco teclado visível (acessibilidade).  
- Não esconder ações críticas só no hover.  

---

## 6. Multi-janela / multi-operador

- Assumir 2+ usuários (reservas + porta).  
- Indicador de frescor; conflito → mensagem doc 13.  

---

## 7. Anti-padrões desktop

- Replicar bottom nav no desktop.  
- Abrir dezenas de modais empilhados.  
- Dashboard com 8 gráficos.  
- Lote sem undo/confirmação (lote fora do MVP).  
