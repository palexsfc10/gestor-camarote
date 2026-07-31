# UX 05 — Aniversários e Convidados

**Produto:** Gestor Camarote  
**MVP visual** + evolução marcada  
**Decisão:** aniversário = tipo de reserva; menu dedicado não é MUST  

---

## 1. Escopo MVP vs evolução

| Elemento | MVP UX | Evolução |
|----------|--------|----------|
| Responsável | Sim | — |
| Aniversariante + nome exibido | Sim | — |
| Data (via evento) | Sim | — |
| Espaço | Sim | — |
| Qtd estimada / limite pacote | Sim | — |
| Pacote + benefícios | Sim | — |
| Lista de convidados (nomes) | Sim | — |
| Link compartilhável | SHOULD | — |
| Observações | Sim (públicas/internas) | — |
| Status (mesmo da reserva) | Sim | — |
| RSVP rico / acompanhante avançado | — | Sim |
| QR Code individual | — | Sim |
| Check-in por convidado | — | Sim |

---

## 2. Fluxo público (extensão do wizard)

Quando experiência = **Aniversário**:

1. PUB-04 Aniversário  
2. PUB-05 Espaço (se pacote exige espaço; hipótese: sim na demo)  
3. PUB-06 Dados do responsável + bloco aniversariante  

```
┌─ Dados do aniversário ───────────────┐
│ Responsável *                        │
│ Aniversariante *                     │
│ Nome exibido na casa * (ex.: Mari)   │
│ Data nasc. (opcional / hipótese)     │
│ Quantidade estimada *                │
└──────────────────────────────────────┘
```

4. PUB-08 inclui **pacotes** em destaque no topo  
5. Ao escolher pacote: mostrar benefícios e limite de convidados  

```
Pacote Neon — R$ 350
Inclui: decoração mesa · 1 bolo · 10 convidados
Limite: 20 pessoas
[ Selecionado ]
```

6. PUB-07 convidados respeita `guestLimit` do pacote  
7. PUB-09 resumo mostra pacote + benefícios  
8. PUB-10 após confirmação SHOULD: “Link para convidados” (se gerado)

---

## 3. Link de convidados (PUB-11) — SHOULD

```
┌──────────────────────────────────────┐
│ Lista de Mari — Sexta Live           │
│ Vagas: 12 de 20                      │
│                                      │
│ Seu nome *                           │
│ [________________]                   │
│                                      │
│ [ Entrar na lista ]                  │
│                                      │
│ Isto não confirma entrada sozinho;   │
│ a casa gerencia a reserva.           │
└──────────────────────────────────────┘
```

Lista cheia → AC-BDAY-001 copy: “A lista atingiu o limite do pacote.”

---

## 4. Visão administrativa

### 4.1 Na Visão de hoje

Card/lista “Aniversários hoje” com nome exibido, espaço, pacote, status.

### 4.2 Em Reservas

Filtro `Tipo: Aniversário`. Badge 🎂 textual “Aniv” (sem depender só de emoji se acessibilidade exigir — usar chip “Aniversário”).

### 4.3 Detalhe (MVP)

```
┌─ ANIVERSÁRIO ────────────────────────┐
│ Exibido: Mari                        │
│ Aniversariante: Mariana Alves        │
│ Pacote: Neon                         │
│ Benefícios: decoração, bolo          │
│ Limite: 20 · Lista: 5 nomes          │
│ [ Copiar link convidados ]           │
│ [ Ver lista ]                        │
└──────────────────────────────────────┘
```

QR individual: placeholder “Em breve” **não** na UI MVP (evitar expectativa) — só roadmap.

---

## 5. Wireframe lista admin de convidados

```
Convidados (5/20)
1. João Silva
2. Ana Costa
…
[ Exportar — WON’T / COULD ]
```

---

## 6. Hipóteses gastrobar

- Pacotes e benefícios reais (OQ-015)  
- Se aniversário sempre exige camarote ou pode ser mesa  
- Se link de convidados será usado na primeira noite  
- Regras de entrada na porta (documento? só nome?)  

---

## 7. Rastreabilidade

- FR-BIRTHDAY-001..004; FR-GUEST-*  
- BR-BDAY-*; DEC-BDAY-001  
- AC-BDAY-001  
- Personas P6, P7, P2  
