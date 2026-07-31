# UX 09 — Calendário e Eventos (UX)

**Produto:** Gestor Camarote  
**Telas:** ADM-09, ADM-10, ADM-11 · espelho PUB-02/03  
**Princípio:** wizard simples — sem editor complexo  

---

## 1. Lista e calendário (ADM-09)

Toggle: **Lista | Calendário**

### Lista

```
┌─ Eventos ────────────── [Lista|Calendário] [+ Novo] ─┐
│ Filtro: Todos | Publicados | Rascunhos | Cancelados  │
│                                                      │
│ Sexta Live · 08/08 · Publicado · 12 reservas         │
│ Sábado Autoral · 09/08 · Rascunho                    │
└──────────────────────────────────────────────────────┘
```

### Calendário mensal

```
        < Agosto 2026 >
 Seg Ter Qua Qui Sex Sáb Dom
              1   2   3
 …
         [08 Live] ← chip
Toque no dia → criar ou listar eventos do dia
```

Chips: cor por status (publicado / rascunho / cancelado) + texto.

---

## 2. Wizard criar/editar evento (ADM-10)

Passos fixos:

```
1 Dados → 2 Espaços → 3 Catálogo → 4 Revisar → Publicar
```

### Passo 1 — Dados principais

```
Título *
Data *  Início *  Fim *
Atração
Imagem [Upload]
Regras (texto)
Descrição pública
Status: Rascunho
[ Continuar ]
```

### Passo 2 — Espaços

```
Selecionar espaços do venue
☑ C01 ☑ C02 … ☑ C08
Por espaço (expandir):
  Disponível no evento: sim
  Preço / consumação / sinal (se usar)
  Capacidade min/max (override)
[ Continuar ]
```

Sem desenhar planta aqui.

### Passo 3 — Catálogo

```
Itens disponíveis neste evento
☑ Balde ☑ Pacote Neon …
Destaque na página do evento: ☑
[ Continuar ]
```

### Passo 4 — Revisar

```
Resumo + Preview link público (após publicar)
[ Salvar rascunho ]  [ Publicar evento ]
```

Publicar = modal:

```
Publicar “Sexta Live”?
O evento aparecerá no site e calendário públicos.
[ Voltar ] [ Publicar ]
```

---

## 3. Detalhe do evento (ADM-11)

```
Sexta Live                    [Publicado]
08/08 22h–04h
[ Copiar link ] [ Abrir site ] [ Mapa ] [ Reservas ]

Ocupação: 3 confirmados · 5 livres · 0 pendentes

Ações: Editar | Duplicar | Despublicar | Cancelar | Reagendar | Arquivar
```

### Cancelar evento

```
Cancelar evento?
Novas solicitações serão bloqueadas.
Reservas abertas deverão ser tratadas pela equipe.
[ Voltar ] [ Cancelar evento ]
```

### Duplicar

Cria rascunho; opção copiar espaços/preços/catálogo (checkboxes).

### Reagendar (SHOULD)

Alerta se há confirmadas (BR-EVENT-003): confirmação reforçada.

---

## 4. Espelho público

- Publicar → PUB-02/03 atualizam (mesma fonte).  
- Despublicar → some de “próximos”; admin mantém.  
- Cancelado → banner público; sem CTA reservar.  

---

## 5. Mobile admin (eventos)

Wizard em tela cheia por passo; sticky Continuar. Calendário mensal usável; criação a partir do dia = atalho.

---

## 6. Rastreabilidade

- FR-EVENT-001..006; FR-CALENDAR-*; FR-PUBLIC-SITE-003  
- AC-EVT-001, 002  
- Fora: recorrência automática, page builder  
