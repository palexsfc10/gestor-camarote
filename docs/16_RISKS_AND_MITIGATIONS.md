# 16 — Riscos e Mitigações

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

Legenda de impacto/probabilidade: A (alta), M (média), B (baixa)

---

## 1. Riscos de produto

| ID | Risco | P | I | Mitigação |
|----|-------|---|---|-----------|
| R-P-01 | Casa continua no WhatsApp e abandona o sistema | A | A | Demo focada em ganho imediato; Visão de hoje + fila; treinamento curto; métrica de uso |
| R-P-02 | Expectativa de ERP/PDV | M | A | Escopo explícito na venda; script de demo; doc comercial “o que não somos” |
| R-P-03 | Formulário público longo demais → abandono | M | A | Campos condicionais; CPF só quando necessário; wizard curto |
| R-P-04 | Mapa fraco na demo não convence | M | A | Template bem feito para o piloto (DEC-MAP-001); não prometer editor livre |
| R-P-05 | Feature creep antes de validar | A | A | Gate documental; WON’T NOW rígido; PO único |
| R-P-06 | Aniversário incompleto gera frustração | M | M | Comunicar MVP parcial; roadmap RSVP/QR |

---

## 2. Riscos operacionais (estabelecimento)

| ID | Risco | P | I | Mitigação |
|----|-------|---|---|-----------|
| R-O-01 | Equipe da porta sem tempo de treinar | A | A | UI de 2 toques; papel reception limitado; checklist de noite |
| R-O-02 | TTL de pré-reserva inadequado | M | M | Configurável; validar na OQ |
| R-O-03 | Sinal manual gera inconsistência | M | M | Status claro; fase 5 pagamento |
| R-O-04 | No-show mal marcado libera espaço cedo/tarde | M | M | Marcação humana; política textual |
| R-O-05 | Dupla operação (planilha + sistema) | A | M | Piloto com acordo de fonte da verdade |

---

## 3. Riscos técnicos (futuros — documentados agora)

| ID | Risco | P | I | Mitigação |
|----|-------|---|---|-----------|
| R-T-01 | Race condition em reserva | M | A | Constraint + testes AC-RES-CONCURRENCY |
| R-T-02 | Vazamento multi-tenant (IDOR) | B | A | Escopo venue obrigatório; testes AUTH |
| R-T-03 | Overengineering de realtime | M | M | Polling/SSE proporcional (DEC-RT-001) |
| R-T-04 | Uploads maliciosos | M | M | Validação tipo/tamanho; storage separado |
| R-T-05 | Indisponibilidade no sábado à noite | B | A | Monitoração; procedimento de contingência WhatsApp |

---

## 4. Riscos de privacidade / legal

| ID | Risco | P | I | Mitigação |
|----|-------|---|---|-----------|
| R-L-01 | Papéis controlador/operador mal definidos | M | A | Contrato + OQ-LGPD antes de dados reais |
| R-L-02 | Coleta excessiva de CPF | M | A | DEC-CPF-001; mascaramento |
| R-L-03 | Tela da porta expõe PII | A | M | Máscara; timeout; treinamento |
| R-L-04 | Pedido de exclusão sem processo | M | M | Canal e runbook simples |

---

## 5. Riscos comerciais

| ID | Risco | P | I | Mitigação |
|----|-------|---|---|-----------|
| R-C-01 | Preço R$ 229,90 rejeitado | M | A | Validar no piloto; empacotar valor operacional |
| R-C-02 | Demo “bonita” sem uso real | M | A | Fase 2 obrigatória com evento real |
| R-C-03 | Implantação artesanal demais (mapa) | M | M | Template NTWS; depois self-service parcial |
| R-C-04 | Dependência de um único gastrobar para aprender | M | M | Documentar aprendizados; segundo piloto na F4 |

---

## 6. Riscos de documentação / inconsistência

| ID | Risco | Mitigação |
|----|-------|-----------|
| R-D-01 | Status redundantes confundem engenharia | Doc 10 consolida; DEC-STATUS-001 |
| R-D-02 | Questões abertas viram “assumidas” | Doc 17 + gate de aprovação |

---

## 7. Plano se o risco se materializar

1. Registrar incidente/aprendizado em `20_PROJECT_STATE` (futuro).  
2. Decidir: ajustar regra, UX, ou adiar feature.  
3. Atualizar DEC / OQ.  
4. Não expandir escopo para “compensar” sem validação.
