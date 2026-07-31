# 07 — Fluxos de Usuário

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

---

## 1. Jornada principal ponta a ponta

```
[Admin] Cadastra evento
   → Define espaços, preços, regras, catálogo
   → Publica
   → Site/calendário atualizam
   → Divulga link (Instagram/WhatsApp)
[Cliente] Acessa link
   → Escolhe modalidade
   → Escolhe espaço disponível
   → Dados + pessoas + adicionais
   → Envia solicitação (NÃO confirmada)
[Sistema] Persiste + pré-reserva / fila
[Admin] Analisa
   → Confirma | Recusa | Pede info/sinal | Espera | Troca espaço
[Cliente] Acompanha status
[Sistema] Itens → preparação (se confirmado)
[Noite] Equipe vê Visão de Hoje + Mapa
   → Check-in / no-show / finaliza
   → Histórico leve
```

---

## 2. Fluxo F-PUB-01 — Descoberta e solicitação pública

**Ator:** Cliente responsável (P5)  
**Entrada:** Link do evento ou calendário  

| Passo | Ação | Sistema |
|------|------|---------|
| 1 | Abre página do evento | Mostra atração, regras, disponibilidade |
| 2 | Escolhe modalidade (camarote/mesa/aniversário/…) | Filtra espaços/regras |
| 3 | Escolhe espaço disponível | Reserva UI hold opcional curto; commit só no envio |
| 4 | Informa dados (conforme política) | Valida telefone/CPF dígitos se exigido |
| 5 | Quantidade de pessoas | Valida min/max |
| 6 | (Opcional) convidados nomes | Salva lista |
| 7 | Adiciona itens do catálogo | Valida disponibilidade/limite |
| 8 | Envia | Cria Reservation `solicitada`; aplica concorrência; anti-dup |
| 9 | Vê confirmação de **envio** | Exibe status + link de acompanhamento |

**Alternativos**

- Espaço fica indisponível no envio → mensagem e lista atualizada.
- Evento cancelado/esgotado → CTA desabilitado.
- Rate limit / Turnstile falhou → bloquear com mensagem clara.

**Exceções**

- Timeout de rede → retry idempotente.
- Validação CPF inválido → erro de campo, sem criar reserva.

**Mensagem obrigatória:** solicitação ≠ reserva confirmada.

---

## 3. Fluxo F-ADM-01 — Triagem e decisão

**Ator:** Admin de reservas (P2)

| Passo | Ação | Efeito |
|------|------|--------|
| 1 | Abre fila / Visão de hoje | Vê pendências |
| 2 | Abre solicitação | Dados, espaço, itens, observações |
| 3a | Confirma | `confirmada` + espaço confirmado + prep |
| 3b | Recusa | `recusada` + libera espaço |
| 3c | Pede informações | `aguardando_informacoes` |
| 3d | Pede sinal | `aguardando_sinal` + instrução manual |
| 3e | Lista de espera | `lista_espera` + libera ou mantém conforme regra |
| 3f | Propõe outro espaço | Valida destino; atualiza EventSpace |

Toda transição gera `ReservationStatusHistory` + audit.

---

## 4. Fluxo F-ADM-02 — Reserva interna / cortesia / bloqueio

**Ator:** P2/P1  

1. Seleciona espaço no mapa ou formulário admin.  
2. Escolhe tipo: interna, cortesia, bloqueio, manutenção.  
3. Preenche motivo/responsável.  
4. Sistema ocupa/bloqueia sem fluxo público.  

---

## 5. Fluxo F-MAP-01 — Operação no mapa

**Ator:** P2/P3  

1. Abre mapa do evento do dia.  
2. Visualiza status por espaço (cor + rótulo).  
3. Toca espaço → drawer com reserva, telefone mascarável, pessoas, itens, sinal, prep, histórico.  
4. Ações contextuais: check-in, observação, no-show, abrir preparação.

---

## 6. Fluxo F-PREP-01 — Preparação

**Ator:** P4  

**Visão A — por reserva:** lista itens daquela mesa/camarote.  
**Visão B — consolidada:** soma por item/catálogo do evento.

| Status prep | Próximos |
|-------------|----------|
| pendente | em_preparacao |
| em_preparacao | pronto |
| pronto | entregue |
| * | cancelado (se reserva cancelada ou item removido) |

---

## 7. Fluxo F-RCV-01 — Recepção / chegada

**Ator:** P3  

1. Busca por nome, telefone parcial ou espaço.  
2. Confere quantidade e observações.  
3. Registra chegada → `cliente_chegou` / espaço `ocupado`.  
4. Ao fim: finalizar; ou marcar no-show se não compareceu após política.

---

## 8. Fluxo F-BDAY-01 — Aniversário (MVP)

**Ator:** P6 (+ P5 se for o responsável)

1. Escolhe modalidade aniversário.  
2. Seleciona pacote (benefícios visíveis).  
3. Dados do aniversariante + nome exibido.  
4. Quantidade estimada / limite.  
5. (SHOULD) gera link de convidados.  
6. Convidados entram com nome (+ acompanhante se permitido).  
7. Casa confirma reserva como nas demais.  
8. Noite: check-in da reserva (não QR individual no MVP).

**Fora do MVP neste fluxo:** RSVP rico, QR, regras de entrada biométricas.

---

## 9. Fluxo F-EVT-01 — Publicação de evento

**Ator:** P1/P2  

1. Criar evento (rascunho).  
2. Associar EventSpaces + preços/regras.  
3. Associar catálogo permitido.  
4. Upload imagem/banner.  
5. Publicar → calendário + site.  
6. Copiar link público para divulgação.

**Alternativos:** duplicar evento anterior; despublicar; cancelar; reagendar (SHOULD).

---

## 10. Fluxo F-CLI-01 — Acompanhamento de status

**Ator:** P5  

1. Abre link/token.  
2. Vê status atual em linguagem humana.  
3. Se `aguardando_informacoes`, envia complemento (SHOULD).  
4. Se `aguardando_sinal`, vê instruções manuais (SHOULD).  
5. Se confirmada, vê resumo do que levar / horário.  
6. Não vê observações internas nem CPF de terceiros.

---

## 11. Fluxo F-EXP-01 — Expiração

**Sistema (job)**  

1. Identifica solicitações/pré-reservas vencidas.  
2. Transiciona para `expirada`.  
3. Libera EventSpace se aplicável.  
4. Registra histórico.  
5. Cliente vê expirada no link.

---

## 12. Mapa de fluxos × princípios

| Princípio | Como o fluxo garante |
|-----------|----------------------|
| Sem confirmação prematura | F-PUB-01 mensagem + status |
| Poucos cliques na noite | F-MAP-01 / F-RCV-01 |
| Sem duplicidade | commit concorrente em F-PUB-01 / F-ADM-01 |
| Uma fonte de verdade | F-EVT-01 publica nos canais públicos |
| Dados mínimos | campos condicionais por tipo |

---

## 13. Wireflow textual — happy path da demo

Ver roteiro narrado em [19_DEMO_SCRIPT.md](19_DEMO_SCRIPT.md).
