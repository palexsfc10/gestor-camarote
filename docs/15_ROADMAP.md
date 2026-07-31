# 15 — Roadmap

**Produto:** Gestor Camarote  
**Fase atual:** 0 — Documentação e validação  
**Nota:** roadmap conceitual — sem estimativas detalhadas de engenharia sem base.

---

## Fase 0 — Documentação e validação *(atual)*

- Visão, escopo, MVP, FRs, NFRs, domínio, estados, LGPD, UX guidelines  
- Decisões e questões abertas  
- Script de demo  
- **Gate:** aprovação humana explícita da documentação  

**Não inclui:** código, scaffolding, deploy.

---

## Fase 1 — Demo funcional

- Implementação do MVP MUST  
- Tenant de demonstração (gastrobar)  
- Publicação em subdomínio `ntws.cloud`  
- Execução do script de demo  
- **Gate:** demo convincente em poucos minutos  

---

## Fase 2 — Piloto com um estabelecimento

- Usuários reais e papéis  
- Evento(s) reais  
- Coleta de métricas  
- Suporte NTWS  
- Ajustes de configuração (TTL, CPF, mapa template)  
- **Gate:** critérios de validação (doc 14)  

---

## Fase 3 — Ajustes após uso real

- Correção de atritos de UX operacional  
- Endurecimento de regras descobertas na casa  
- Melhorias de mapa (possível evolução para pins em planta — opção C)  
- Performance e observabilidade  
- **Gate:** estabilidade + satisfação da casa  

---

## Fase 4 — Produto comercial multi-tenant

- Onboarding de novos venues  
- Billing/assinatura (preço-alvo validado)  
- Materiais de implantação NTWS  
- Hardening segurança e isolamento  
- **Gate:** primeiro cliente pagante além do piloto (ou piloto convertendo)  

---

## Fase 5 — Pagamentos, automações e integrações

- Gateway de pagamento / sinal online  
- Notificações (e-mail/WhatsApp API — avaliar compliance)  
- Automações leves de status  
- Relatórios comerciais melhores  
- **Gate:** receita adicional ou redução de trabalho manual mensurável  

---

## Fase 6 — Inteligência artificial

- Sugestões (ex.: previsão de no-show, copy de evento, consolidação inteligente)  
- Sempre opt-in e com dados já estruturados das fases anteriores  
- **Gate:** valor claro sem degradar simplicidade  

---

## Itens explícitos “mais tarde” (não datados)

- App nativo  
- Marketplace  
- PDV/fiscal  
- Estoque completo  
- Eventos recorrentes automáticos  
- QR de entrada  
- Page builder  
- Multi-idioma  

---

## Dependências entre fases

```
F0 aprovação → F1 demo → F2 piloto → F3 ajustes → F4 comercial
                                      ↘ pode alimentar F5 cedo se pagamento for bloqueio
F6 só após dados e produto estáveis
```

---

## Política de avanço

Nenhuma fase técnica inicia sem **autorização explícita**.  
Esta execução encerra na documentação da Fase 0.
