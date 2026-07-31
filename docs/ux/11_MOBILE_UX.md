# UX 11 — Mobile UX

**Produto:** Gestor Camarote  
**Escopo:** público + operação noturna admin  

---

## 1. Princípios mobile

1. Ações principais no alcance do polegar (zona inferior).  
2. Alvos de toque ≥ 44×44 px.  
3. Navegação curta (bottom nav 5 itens).  
4. Evitar tabelas largas — cards e listas.  
5. Filtros em bottom sheet / chips, não multi-coluna.  
6. Mapa sempre com alternativa em lista.  
7. Confirmações críticas em modal full-width legível.  
8. Teclado: inputs com `inputmode` adequado (tel, numeric).  
9. Safe areas (notch).  
10. Contraste para ambiente noturno / meia-luz.  

---

## 2. Bottom navigation (admin)

| Slot | Destino |
|------|---------|
| 1 | Hoje |
| 2 | Reservas (badge pendências) |
| 3 | Mapa |
| 4 | Preparação |
| 5 | Mais (Eventos, Cardápio, Site, Clientes, Config, Sair) |

---

## 3. Padrões por fluxo

### Público (wizard)
- Um passo por tela.  
- CTA sticky inferior.  
- Progresso compacto no topo.  
- Banner fixo de honestidade de status.  

### Visão de hoje
- Cards empilhados; pendências primeiro.  
- Sem grid 3 colunas.  

### Reservas
- Cards; swipe actions = **não** no MVP (risco acidente). Só botões.  

### Mapa
- Toggle Lista | Mapa.  
- Detalhe = bottom sheet (snap 40%/90%).  
- Não exigir pinch para operar.  

### Preparação
- Toggle A/B no topo.  
- Botões de status full-width por item.  

### Check-in
- Busca sticky.  
- CTA Chegou dominante.  

---

## 4. Gestos

| Gesto | Uso MVP |
|-------|---------|
| Tap | Primário |
| Pull-to-refresh | SHOULD em Hoje/Reservas/Mapa |
| Pinch | Opcional no mapa; não obrigatório |
| Swipe to delete | Não |

---

## 5. Performance percebida

- Skeleton em listas.  
- Botão submit com loading.  
- Indicador “Atualizado há Xs”.  
- Offline: banner + disable ações mutáveis com mensagem.  

---

## 6. Anti-padrões (proibidos no MVP mobile)

- Mega-menu hambúrguer com 15 itens na operação.  
- Tabelas com scroll horizontal como único meio.  
- Tooltips hover-only.  
- Modais com texto de consequências cortado.  
- Dependência exclusiva de cor no mapa.  
