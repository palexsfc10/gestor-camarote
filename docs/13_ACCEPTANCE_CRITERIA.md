# 13 — Critérios de Aceite

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Formato:** Given / When / Then (testáveis)

---

## AC-RES-CONCURRENCY-001 — Sem dupla confirmação de espaço

Given que o camarote 07 está disponível para o evento  
And dois clientes tentam reservá-lo simultaneamente  
When as duas solicitações chegam à API  
Then apenas uma reserva deve adquirir o espaço  
And a outra deve receber uma resposta de indisponibilidade  
And o sistema não deve produzir duas confirmações válidas  
And o EventSpace permanece com no máximo uma reserva ocupante ativa.

---

## AC-RES-001 — Solicitação não é confirmação

Given um evento publicado com mesa disponível  
When o cliente envia a solicitação com dados válidos  
Then a reserva é criada com status `solicitada`  
And a UI pública exibe mensagem de solicitação enviada  
And a UI pública não exibe o status como confirmada  
And a fila admin contém a nova solicitação.

---

## AC-RES-002 — Confirmação pela casa

Given uma reserva `solicitada` no camarote 03  
And o camarote 03 ainda está pré-reservado para ela  
When o admin confirma  
Then o status passa a `confirmada`  
And o espaço fica `confirmado`  
And o histórico de status registra ator, de→para e timestamp  
And os ReservationItems geram PreparationItems `pendente`  
And o link do cliente passa a mostrar confirmada.

---

## AC-RES-003 — Recusa libera espaço

Given uma reserva `solicitada` no espaço M12  
When o admin recusa  
Then o status é `recusada`  
And M12 fica `disponivel`  
And outro cliente pode solicitar M12.

---

## AC-RES-004 — Expiração

Given uma reserva `solicitada` com `expiresAt` no passado  
When o job de expiração executa  
Then o status torna-se `expirada`  
And o espaço associado volta a `disponivel`  
And o link do cliente mostra expirada.

---

## AC-RES-005 — Idempotência de envio

Given o cliente enviou uma solicitação com Idempotency-Key K  
When reenvia a mesma requisição com a chave K em até 24h  
Then o sistema não cria segunda reserva  
And retorna a mesma reserva (ou equivalente sem side effect duplicado).

---

## AC-RES-006 — Cancelamento cancela preparação

Given uma reserva `confirmada` com itens em preparação `pendente`  
When a casa cancela a reserva  
Then o status da reserva é `cancelada_casa`  
And os PreparationItems não entregues ficam `cancelado`  
And o espaço é liberado.

---

## AC-RES-007 — Troca de espaço atômica

Given reserva confirmada no camarote 01  
And camarote 02 disponível  
When admin move a reserva para o camarote 02  
Then camarote 02 fica associado e confirmado  
And camarote 01 fica disponível  
And nunca existem dois EventSpaces confirmados para a mesma reserva simultaneamente.

---

## AC-EVT-001 — Publicação reflete no site

Given um evento em rascunho com imagem e atração  
When o admin publica  
Then o calendário público lista o evento  
And a página do evento fica acessível pelo link  
And o painel e o público leem os mesmos título, data e status publicado.

---

## AC-EVT-002 — Evento cancelado bloqueia novas solicitações

Given um evento publicado  
When o admin cancela o evento  
Then a página pública indica cancelado  
And o CTA de nova reserva não cria Reservation  
And tentativas de API retornam erro de regra de negócio.

---

## AC-SPACE-001 — Bloqueio remove do fluxo público

Given o camarote 05 disponível no evento  
When o admin bloqueia o camarote 05  
Then o fluxo público não lista o camarote 05 como selecionável  
And o mapa admin mostra bloqueado.

---

## AC-MAP-001 — Detalhe do espaço

Given o camarote 04 confirmado para Ana com 5 pessoas e 2 itens  
When o recepcionista seleciona o camarote 04 no mapa  
Then visualiza responsável, quantidade, itens, status e observações internas  
And o CPF, se existir, aparece mascarado por padrão.

---

## AC-TODAY-001 — Visão de hoje acionável

Given um evento no timezone do venue ocorre “hoje”  
And existem 3 solicitações pendentes e 2 preparações pendentes  
When o admin abre a Visão de hoje  
Then vê o evento do dia  
And vê contagem de pendências de reserva  
And vê contagem de preparações pendentes  
And consegue navegar para a fila e para a preparação a partir da tela.

---

## AC-PREP-001 — Duas visões

Given 3 reservas confirmadas pedindo o mesmo combo (qtd 2, 1, 1)  
When a equipe abre a visão consolidada por item  
Then o combo aparece com quantidade total 4  
When abre a visão por reserva  
Then cada reserva lista seus itens separadamente.

---

## AC-PREP-002 — Avanço de status

Given PreparationItem `pendente`  
When a equipe marca `em_preparacao` e depois `pronto`  
Then os status persistem  
And aparecem nos filtros correspondentes.

---

## AC-BDAY-001 — Limite de convidados

Given pacote de aniversário com limite 20  
And já existem 20 nomes na lista  
When um convidado tenta entrar pelo link  
Then o sistema recusa a inclusão  
And informa que a lista está cheia.

---

## AC-CAT-001 — Snapshot de preço

Given item “Balde de Heineken” a R$ 99 no momento da solicitação  
When o admin depois altera o preço do catálogo para R$ 120  
Then a ReservationItem mantém unitPriceSnapshot 99  
And a preparação referencia o item da reserva sem alterar o valor histórico.

---

## AC-CAT-002 — Item esgotado

Given item com status `sold_out`  
When o cliente monta a solicitação  
Then o item não pode ser adicionado  
And se tentar via API recebe erro de validação.

---

## AC-AUTH-001 — Isolamento tenant

Given usuário autenticado no Venue A  
When solicita listagem de reservas do Venue B (ID conhecido)  
Then recebe negação (403/404 sem vazamento)  
And nenhuma reserva de B é retornada.

---

## AC-AUTH-002 — Papel recepção

Given usuário com role reception  
When tenta publicar evento ou alterar preço de catálogo  
Then a ação é negada  
And pode registrar check-in em reserva confirmada do seu venue.

---

## AC-AUTH-003 — Token público

Given token de acompanhamento da reserva R1  
When um usuário acessa o link  
Then vê apenas dados da R1  
And não consegue enumerar R2 alterando IDs sequenciais (IDs opacos).

---

## AC-PRIV-001 — Mascaramento CPF

Given reserva com CPF cadastrado  
When admin abre a fila sem ação de revelar  
Then CPF aparece mascarado  
When revela o CPF  
Then o sistema registra log de acesso sensível (se feature SHOULD ativa).

---

## AC-CLI-001 — Check-in

Given reserva `confirmada`  
When recepção registra chegada  
Then status vira `cliente_chegou`  
And CheckIn é persistido com usuário e horário  
And o mapa mostra espaço `ocupado`.

---

## AC-CLI-002 — No-show

Given reserva `confirmada` no dia do evento sem chegada  
When recepção marca no-show  
Then status é `no_show`  
And o espaço fica `disponivel` por padrão  
And preparação pendente é cancelada.

---

## AC-NFR-PERF-001 — Resposta de solicitação

Given ambiente de demo com carga do piloto  
When o cliente submete solicitação válida  
Then a API responde sucesso ou erro de negócio em ≤ 3 s no p95 medido no teste acordado.

---

## AC-ABUSE-001 — Rate limit

Given um IP excedeu o limite de POSTs de reserva  
When envia nova solicitação  
Then recebe 429  
And nenhuma reserva adicional é criada nesse request.
