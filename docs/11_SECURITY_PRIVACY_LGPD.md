# 11 — Segurança, Privacidade e LGPD

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

---

## 1. Princípios

1. Minimização: coletar só o necessário à reserva e operação.  
2. Finalidade: operação de reservas/eventos do estabelecimento.  
3. Transparência: aviso claro no fluxo público.  
4. Segurança: proteção, mascaramento, auditoria de acesso sensível.  
5. CPF não é identidade comprovada.  
6. Cliente não é “usuário de rede social da NTWS” — é titular atendido pelo controlador (definir papel).

---

## 2. Papéis (proposta)

| Papel | Quem | Nota |
|-------|------|------|
| **Controlador** | Estabelecimento (Venue) | Decide finalidade da reserva |
| **Operador** | NTWS Labs | Trata dados para prestar o SaaS |
| **Titular** | Cliente / convidados | |

**Validação jurídica necessária antes do piloto com dados reais** (OQ-LGPD-001).

---

## 3. Dados coletados — avaliação

| Dado | Necessidade | Recomendação MVP |
|------|-------------|------------------|
| Nome completo | Alta | Obrigatório responsável |
| Telefone | Alta | Obrigatório |
| WhatsApp | Alta (operação casa) | Pode ser = telefone; campo único “WhatsApp/telefone” |
| E-mail | Média | Opcional SHOULD (link/status) |
| CPF | Condicional | Obrigatório só com responsabilidade financeira; senão opcional |
| Data nascimento | Baixa–média (aniversário) | Obrigatória só no fluxo aniversário se casa exigir; senão opcional |
| Qtd pessoas | Alta | Obrigatória |
| Horário previsto chegada | Média | Opcional / SHOULD |
| Observações | Baixa | Opcional |
| Tipo comemoração | Média | Opcional / obrigatório em aniversário |
| Nome convidados | Média | Opcional lista; obrigatório se lista for feature usada |

### Recomendação CPF (DEC-CPF-001)

**Obrigatório apenas quando houver responsabilidade financeira explícita** (preço de espaço > 0, consumação mínima, sinal, ou pacote pago).  
**Opcional** em mesa simples / lista sem cobrança.  
Venue pode configurar “sempre exigir”.

**Justificativas**

- Reduz atrito e superfície LGPD.  
- Ainda permite unicidade/controle onde há risco financeiro.  
- Evita tratar CPF como credencial.  
- Alinha com coleta mínima.

---

## 4. Controles técnicos

| Controle | Requisito |
|----------|-----------|
| Validação dígitos CPF | Sim, se presente |
| CPF único por evento | SHOULD quando exigido |
| Telefone único por evento | SHOULD (validar exceções) |
| Rate limit | MUST |
| Idempotência | MUST |
| Turnstile/CAPTCHA | SHOULD/MUST |
| HTTPS | MUST |
| Mascaramento painel | MUST para CPF; telefone parcial SHOULD |
| Log acesso CPF completo | SHOULD |
| Criptografia em repouso | MUST em produção |
| Retenção mínima | Definir com venue; proposta abaixo |
| Anonimização | Processo documentado; job futuro |

---

## 5. Mascaramento e exibição

| Contexto | CPF | Telefone |
|----------|-----|----------|
| Fila admin | mascarado | parcial (****9999) |
| Recepção | revelar sob ação | parcial → completo sob ação |
| Preparação | não exibir CPF | só se necessário à entrega |
| Link público cliente | nunca CPF | só do próprio responsável se útil |
| Audit payload | não armazenar CPF claro | refs |

---

## 6. Retenção (proposta piloto)

| Conjunto | Retenção proposta |
|----------|-------------------|
| Reservas e histórico operacional | 12 meses após evento |
| Dados de cliente sem novas reservas | 12 meses após última interação |
| Audit logs | 12 meses |
| Logs de aplicação | 30–90 dias |
| Backups | ciclo do provedor ≤ 30–35 dias |

Após retenção: anonimizar Customer (nome genérico, purge telefone/email/CPF) mantendo métricas agregadas.

**Validar com estabelecimento e jurídico.**

---

## 7. Direitos do titular (processo)

Mesmo sem portal self-service no MVP:

- Canal do estabelecimento + suporte NTWS para: acesso, correção, eliminação, oposição.  
- SLA interno de atendimento a solicitações (proposta: 15 dias).  

---

## 8. Aviso no fluxo público (conteúdo mínimo)

- Quem coleta (nome da casa).  
- Para que (reserva/operação do evento).  
- Que a solicitação não garante confirmação.  
- Contato para privacidade.  
- Link para política (página simples).  

---

## 9. Segurança operacional

- Papéis mínimos (RBAC).  
- Sem compartilhar login genérico “da porta” com gestor (ideal: usuários distintos).  
- Telas de recepção com timeout de sessão curto (SHOULD).  
- Proibir screenshots? Impraticável — mitigar com mascaramento e treino.

---

## 10. Incidentes

Processo mínimo:

1. Detecção / contensão  
2. Avaliação de risco ao titular  
3. Comunicação conforme LGPD se aplicável  
4. Pós-incidente e registro  

---

## 11. O que não fazer no MVP

- Usar CPF como login.  
- Enriquecer dados com bureaus.  
- Vender base.  
- Exigir documentos de convidados.  
- Biometria.

---

## 12. Checklist antes do piloto com dados reais

- [ ] Contrato controlador-operador alinhado  
- [ ] Política de privacidade publicada no site do venue  
- [ ] Decisão CPF configurada  
- [ ] Mascaramento ativo  
- [ ] Retenção acordada  
- [ ] Canal de atendimento a titulares  
- [ ] Backup e acesso admin NTWS documentados  
