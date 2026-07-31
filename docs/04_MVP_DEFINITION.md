# 04 — Definição do MVP

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Objetivo do MVP:** demo funcional + base para piloto com um gastrobar  

---

## 1. Declaração do MVP

O MVP deve permitir que um estabelecimento:

1. Cadastre espaços e um evento.
2. Publique o evento no site/calendário público.
3. Receba solicitações de reserva pelo link.
4. Analise e confirme/recuse/ajuste no painel.
5. Veja o mapa visual atualizado.
6. Consolide itens na preparação.
7. Registre chegada e finalize/no-show.
8. Mantenha rastreabilidade mínima das ações críticas.

Tudo isso em arquitetura **multi-tenant**, mesmo com um único tenant na demo.

## 2. Hipótese a validar

> Em poucas semanas de uso (ou em demonstração realista), a casa percebe redução de caos operacional e considera pagar ~R$ 229,90/mês.

## 3. Capabilidades MUST (MVP)

| ID | Capabilidade |
|----|--------------|
| MVP-01 | Multi-tenant básico (Organization/Venue isolados) |
| MVP-02 | Cadastro de venue e personalização leve da página pública |
| MVP-03 | Cadastro de espaços e tipos |
| MVP-04 | CRUD de eventos + publicar/despublicar/cancelar/duplicar |
| MVP-05 | Disponibilidade de espaços por evento |
| MVP-06 | Site público: home + calendário + página do evento |
| MVP-07 | Fluxo público de solicitação (espaço, dados, pessoas, adicionais) |
| MVP-08 | Fila administrativa de solicitações com ações principais |
| MVP-09 | Máquina de estados de reserva (conjunto MVP) |
| MVP-10 | Impedimento de dupla ocupação do mesmo espaço no evento |
| MVP-11 | Mapa visual (template NTWS / grade posicionada — ver DEC) |
| MVP-12 | Visão de hoje |
| MVP-13 | Catálogo básico + itens na reserva |
| MVP-14 | Preparação (visão por reserva e consolidada por item) |
| MVP-15 | Check-in / no-show / finalização |
| MVP-16 | Histórico de status da reserva |
| MVP-17 | Audit log de ações críticas |
| MVP-18 | Proteções: rate limit, idempotência, anti-bot |
| MVP-19 | Acompanhamento de status pelo cliente (link da solicitação) |
| MVP-20 | Fluxo de aniversário parcial (pacote + aniversariante + lista básica) |

## 4. Capabilidades SHOULD (desejáveis se caberem na demo)

| ID | Capabilidade |
|----|--------------|
| MVP-S1 | Lista de espera |
| MVP-S2 | Solicitação de sinal (registro manual, sem gateway) |
| MVP-S3 | Propor/trocar espaço |
| MVP-S4 | E-mail ou página de status bem polida |
| MVP-S5 | Mascaramento de CPF e log de acesso a dado sensível |
| MVP-S6 | Duplicar evento com espaços e preços |

## 5. Capabilidades COULD (só se não atrasar validação)

| ID | Capabilidade |
|----|--------------|
| MVP-C1 | Cortesia e reserva interna no mesmo fluxo admin |
| MVP-C2 | Bloqueio manual / manutenção no mapa |
| MVP-C3 | Destaques de cardápio no site |
| MVP-C4 | Horário limite de chegada por tipo |

## 6. WON’T NOW (explicitamente fora do MVP)

- PDV, fiscal, comanda, contábil, RH, estoque completo, KDS, delivery, fornecedores
- Marketplace, app nativo, IA
- Pagamento online / gateway
- WhatsApp API oficial
- Page builder
- Eventos recorrentes automáticos
- QR Code de entrada
- RSVP avançado com acompanhantes ilimitados e regras complexas
- Editor livre de planta (drag-and-drop avançado)
- Histórico CRM profundo do cliente
- App offline-first completo

## 7. Tipos de reserva no MVP

| Tipo | MVP |
|------|-----|
| Camarote | MUST |
| Mesa | MUST |
| Aniversário | MUST (parcial) |
| Lista de convidados | SHOULD (mínimo) |
| Bistrô / VIP | SHOULD (como SpaceType configurável) |
| Cortesia | COULD |
| Reserva interna (admin) | SHOULD |
| Bloqueio manual | SHOULD |
| Manutenção | COULD |
| Reserva feita pela administração | SHOULD (mesmo modelo, origem=admin) |

## 8. Status de reserva no MVP (conjunto reduzido)

Recomendação consolidada (detalhe em doc 10):

**MVP MUST:** `solicitada`, `aguardando_informacoes`, `aguardando_sinal`, `confirmada`, `cliente_chegou`, `finalizada`, `cancelada_cliente`, `cancelada_casa`, `recusada`, `no_show`, `expirada`

**SHOULD:** `lista_espera`, `em_atendimento`

**Adiado / fundido:** `em_analise` → tratado como subestado visual de `solicitada` na fila (evitar redundância)

## 9. Status de espaço no MVP

**MUST:** `disponivel`, `pre_reservado`, `confirmado`, `ocupado`, `bloqueado`, `indisponivel`

**SHOULD:** `manutencao`

**Fundido:** `aguardando_confirmacao` → equivalente a `pre_reservado` ligado à reserva solicitada/aguardando

## 10. Mapa visual — escolha MVP

**Recomendação:** alternativa **D** — template configurado pela NTWS na implantação, com fallback visual de **grade simplificada (B)** se o template atrasar.

Não fazer editor livre (A) no MVP.  
Upload de planta com pins (C) fica como evolução imediata pós-piloto.

Justificativa completa em [18_PRODUCT_DECISIONS.md](18_PRODUCT_DECISIONS.md) (DEC-MAP-001).

## 11. Tempo real — escolha MVP

**Recomendação:** atualização periódica curta no painel operacional + invalidação após ações locais; SSE como evolução se o polling for insuficiente.

Ver DEC-RT-001.

## 12. CPF — escolha MVP

**Recomendação:** obrigatório apenas quando houver **responsabilidade financeira explícita** (ex.: camarote com valor/consumação/sinal, pacote de aniversário com cobrança). Opcional em mesa simples / lista, configurável por venue.

Ver DEC-CPF-001 e [11_SECURITY_PRIVACY_LGPD.md](11_SECURITY_PRIVACY_LGPD.md).

## 13. Critério “MVP pronto para demo”

O script em [19_DEMO_SCRIPT.md](19_DEMO_SCRIPT.md) deve ser executável ponta a ponta em ambiente publicado (ex.: subdomínio `ntws.cloud`) com dados do gastrobar piloto.

## 14. Critério “MVP pronto para piloto”

Além da demo:

- usuários reais da casa com papéis;
- pelo menos um evento real;
- métricas básicas coletáveis;
- suporte NTWS definido;
- política de dados alinhada com o estabelecimento.

## 15. Fora do critério de sucesso do MVP

- Automação completa sem operador humano
- 100% das casas do Brasil
- Paridade com ERP
- Monetização via consumidor final
