# UX 07 — Fluxo de Check-in e Porta

**Produto:** Gestor Camarote  
**Personas:** P3 Recepção, P2  
**Princípio:** achar reserva e marcar chegada em segundos  

---

## 1. Entradas para check-in

| Origem | Ação |
|--------|------|
| Mapa → espaço confirmado | Bottom sheet → **Chegou** |
| Detalhe da reserva | Botão **Registrar chegada** |
| Lista reservas (filtro confirmadas) | Ação rápida |
| Visão de hoje → Chegaram (consulta) | — |

Não exigir rota isolada MUST; padrão de interação unificado.

---

## 2. Busca na porta

```
┌─ Busca rápida ───────────────────────┐
│ [ Nome, telefone ou espaço…    ] 🔍  │
│ Resultados:                          │
│ C07 · Mariana · Confirmada · 5 pess. │
│ M03 · …                              │
└──────────────────────────────────────┘
```

- Sticky no topo (mapa e lista).  
- Telefone busca por final (****-0007).  
- CPF não é campo de busca primário (privacidade).  

---

## 3. Fluxo feliz

```
Confirmada → (opcional confirmar leve) → cliente_chegou
Espaço: confirmado → ocupado
CheckIn persistido (quem, quando)
```

### Wireframe bottom sheet (mobile)

```
┌──────────────────────────────────────┐
│ Camarote 07 · Confirmado             │
│ Mariana Alves                        │
│ Tel (11) *****-0007  [Mostrar]       │
│ 5 pessoas · prev. 23:30              │
│ Aniv: Mari · Pacote Neon             │
│ Itens: 2× balde, pacote              │
│ Prep: 1 pronto · 1 pendente          │
│ Obs internas: “levar vela”           │
│                                      │
│ [ Chegou ]          ← primário       │
│ [ Abrir reserva ] [ No-show ]        │
└──────────────────────────────────────┘
```

### Confirmação leve

```
Registrar chegada de Mariana no Camarote 07?
[ Cancelar ]  [ Confirmar chegada ]
```

Feedback: toast “Chegada registrada” + status visual do mapa atualiza.

---

## 4. No-show

Disponível para `confirmada` (não para quem já chegou, salvo correção admin — SHOULD com audit).

Modal de consequências (doc 04). Espaço reabre por padrão (DEC-NOSHOW — ainda proposta de produto; UX assume default aprovável).

---

## 5. Finalizar

Ao encerrar a noite / saída:

```
Finalizar reserva?
Status passará a Finalizada.
[ Cancelar ] [ Finalizar ]
```

Pode ser feito em lote? **Não no MVP** (risco). Só individual.

---

## 6. Erros e edge cases

| Caso | UX |
|------|-----|
| Reserva não confirmada | CTA Chegou disabled; “Confirme a reserva antes” |
| Já chegou | Mostra horário do check-in; CTA vira Finalizar |
| Outro operador acabou de marcar | “Já registrada por {nome} às {hora}” |
| Sem conexão | Não afirmar sucesso; retry |
| Acesso recepção | Pode check-in; não edita preço/evento |

---

## 7. Privacidade na porta

- CPF/telefone mascarados por padrão.  
- “Mostrar” com log SHOULD.  
- Evitar projetar tela em TV sem máscara (orientação operacional, não feature).  

---

## 8. Rastreabilidade

- FR-RESERVATION-012..014; AC-CLI-001, 002  
- Personas P3  
- UX-Q-03 (guidelines): check-in ≤2 toques a partir do mapa  
