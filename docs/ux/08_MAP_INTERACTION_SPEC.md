# UX 08 — Especificação de Interação do Mapa

**Produto:** Gestor Camarote  
**Tela:** ADM-05  
**Decisão:** template NTWS por estabelecimento; grade = fallback MVP  
**Demo:** palco, backstage, 8 camarotes, mesas opcionais, legenda  

---

## 1. Objetivos

1. Ver ocupação espacial do evento em um olhar.  
2. Selecionar espaço → detalhe + ações.  
3. Não depender só da precisão do toque no desenho (mobile: lista alternativa).  

---

## 2. Anatomia da tela

### Desktop

```
┌─ Mapa · Sexta Live ▼ ──────── [Lista] [Legenda] ───┐
│                                                    │
│     [BACKSTAGE]                                    │
│ ┌C01┐ ┌C02┐ ┌C03┐ ┌C04┐                            │
│ │OK │ │OK │ │PRÉ│ │LIV│                            │
│ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘                            │
│     └─────[  PALCO  ]─────┘                        │
│ ┌C05┐ ┌C06┐ ┌C07┐ ┌C08┐                            │
│ │OK │ │LIV│ │OK │ │LIV│   ← C07 confirmado demo  │
│ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘                            │
│  (mesas opcionais abaixo / outra zona)             │
│                                                    │
│ Legenda: Livre | Pré | Sinal | OK | Local | Bloq…  │
├─────────────────────── Drawer direito ─────────────┤
│ (detalhe do espaço selecionado)                    │
└────────────────────────────────────────────────────┘
```

### Mobile

```
┌─ Mapa · Evento ▼ ──── [Lista|Mapa] ─┐
│  Mapa reduzido (pinch leve opcional)│
│  Toque no camarote → seleciona      │
│  OU                                 │
│  Aba Lista:                         │
│   C07 Confirmado · Mariana          │
│   C06 Livre                         │
├─ Bottom sheet ──────────────────────┤
│  Detalhe + [Chegou] …               │
└─────────────────────────────────────┘
```

**Regra:** em viewports <768px, default pode ser **Lista** se o template for denso; toggle sempre disponível. Hipótese de usabilidade — validar no piloto.

---

## 3. Status visuais (mapa)

Alinhados à operação (UI); rótulo textual obrigatório (não só cor).

| Status visual | Quando | Cor conceitual | Rótulo |
|---------------|--------|----------------|--------|
| disponível | livre | neutro claro | Livre |
| pré-reservado | solicitada / aguardando_info | âmbar | Pré |
| aguardando sinal | aguardando_sinal | âmbar escuro / ícone $ | Sinal |
| confirmado | confirmada | verde | OK |
| ocupado | cliente_chegou | azul escuro | Local |
| bloqueado | bloqueio admin | cinza | Bloq |
| manutenção | bloqueio motivo manutenção | cinza hatch | Manut |
| indisponível | fora do evento | oculto ou hatch | — |

Nota: `aguardando sinal` é **ênfase visual** sobre pré-reserva (mesmo EventSpace pré-reservado). Não contradiz fusão `aguardando_confirmacao`→`pre_reservado` do domínio.

---

## 4. Conteúdo ao selecionar espaço

| Campo | Exibição |
|-------|----------|
| Nome / código | Camarote 07 |
| Estado | Confirmado |
| Responsável | Nome |
| Telefone | Mascarado + Mostrar |
| Pessoas | 5 |
| Horário | 23:30 |
| Adicionais | Lista curta snapshot |
| Preparação | Contagem por status |
| Observações internas | Sim (admin) |
| Status reserva | Chip |
| Pagamento/sinal | Valor/status se houver |
| Ações | Conforme status + papel |

Espaço livre:

```
Camarote 06 · Livre
Capacidade 4–8 · Valor R$ …
[ Bloquear ] [ Criar reserva admin ]
```

---

## 5. Ações por estado × papel

| Estado | Reservas | Recepção |
|--------|----------|----------|
| Livre | Criar reserva / Bloquear | — |
| Pré / Sinal | Abrir solicitação | Abrir (leitura) |
| OK | Abrir / Chegou / No-show | Chegou / No-show |
| Local | Abrir / Finalizar | Finalizar |
| Bloq/Manut | Desbloquear | — |

---

## 6. Template NTWS (demo)

Elementos fixos do template piloto (hipótese de layout — validar planta OQ-005):

1. Zona superior: Backstage  
2. Centro: Palco  
3. Oito camarotes numerados 01–08 em duas fileiras  
4. Zona opcional mesas (se venue usar)  
5. Entrada marcada se fizer sentido visual  

Fallback **grade 2×4** só com células C01–C08 + legenda se template atrasar.

Implantação: Configurações → mapa = “Configurado pela NTWS” (readonly para o venue no MVP).

---

## 7. Atualização em tempo quase real

- Polling/SSE do EventSpace status.  
- Após ação local: update otimista revertível se API falhar.  
- Conflito: “Espaço atualizado por outro operador” + refresh detalhe.  

---

## 8. Acessibilidade do mapa

- Cada espaço = botão/controle com `aria-label` “Camarote 07, confirmado”.  
- Legenda com texto.  
- Lista alternativa equivalente funcionalmente.  

---

## 9. Rastreabilidade

- FR-SPACE-005; AC-MAP-001; DEC-MAP-001  
- NFR-A11Y-001; UX mobile doc 11  
- Risco R-P-04 mapa fraco → template + lista  
