# 00 — Visão do Produto

**Produto:** Gestor Camarote (nome de trabalho)  
**Organização:** NTWS Labs  
**Fase:** 0 — Documentação e validação  
**Audiência:** stakeholders, UX, engenharia (futura), implantação  

---

## 1. Propósito

Centralizar a divulgação de eventos e a operação de reservas de espaços (camarotes, mesas, bistrôs, VIP e outras modalidades) para bares, gastrobares e casas noturnas — desde o link público compartilhado no Instagram/WhatsApp até a preparação e o check-in na noite do evento.

## 2. Visão comercial

> Uma plataforma digital para divulgar eventos, receber reservas, organizar camarotes, mesas, aniversários, convidados e preparar a operação da casa.

## 3. Visão de produto (o que NÃO somos no início)

O produto **não** nasce como ERP completo para bares.  
Não compete, no MVP, com PDV, fiscal, contábil, estoque profundo, delivery ou marketplace.

O sucesso inicial é provar que a casa:

1. publica um evento uma vez;
2. recebe solicitações organizadas;
3. confirma sem conflito de espaços;
4. enxerga a operação da noite;
5. prepara itens antecipados;
6. reduz o caos de WhatsApp/DM.

## 4. Proposta de valor

| Para | Valor |
|------|-------|
| Estabelecimento | Menos retrabalho, menos conflito de reserva, visão operacional da noite |
| Cliente final | Fluxo claro de solicitação, status transparente, sem falsa confirmação |
| NTWS Labs | SaaS vertical multi-tenant, demo comercialmente demonstrável, preço-alvo de validação ~R$ 229,90/mês |

## 5. Princípios obrigatórios

1. **Mobile-first.**
2. **Interface extremamente simples.**
3. **Uso rápido em noites movimentadas.**
4. **Poucos cliques para ações frequentes.**
5. **Não parecer ERP complexo.**
6. **Painel principal responde: “O que está acontecendo hoje?”**
7. **Tela visual de mesas e camarotes é central.**
8. **Evitar reservas duplicadas.**
9. **Rastreabilidade em ações críticas.**
10. **Cliente não recebe confirmação antes da aprovação da casa.**
11. **Coletar dados pessoais só quando necessários.**
12. **Histórico de clientes leve e proporcional.**
13. **Informações sensíveis protegidas e mascaradas.**
14. **Site público e painel compartilham a mesma fonte de dados.**
15. **Cadastrar uma vez atualiza todas as áreas relevantes.**
16. **Adaptável a diferentes tipos de estabelecimento.**
17. **MVP prova utilidade operacional antes de recursos avançados.**
18. **Preparar para futura IA, sem desenvolver IA agora.**

## 6. Usuários principais

- Dono/gestor da casa  
- Administrador de reservas  
- Recepção  
- Preparação  
- Cliente responsável pela reserva  
- Aniversariante  
- Convidado  

Detalhamento em [02_PERSONAS_AND_JTBD.md](02_PERSONAS_AND_JTBD.md).

## 7. Jornada principal (resumo)

Casa cadastra e publica evento → calendário/site atualizam → cliente solicita pelo link público → casa analisa e decide → preparação recebe itens → no dia, equipe opera e registra chegada/finalização → histórico leve permanece.

Fluxo completo em [07_USER_FLOWS.md](07_USER_FLOWS.md).

## 8. Posicionamento de mercado

| Dimensão | Posição |
|----------|---------|
| Categoria | SaaS vertical operacional para reservas de eventos em bares |
| Diferencial inicial | Operação da noite + mapa + preparação + site/calendário unificados |
| Modelo | Multi-tenant; demo com um estabelecimento |
| Canal de aquisição do cliente final | Links públicos (Instagram, WhatsApp, etc.) — não marketplace |
| Monetização alvo (validação) | Assinatura mensal do estabelecimento |

## 9. Fronteiras explícitas do MVP

Fora do MVP inicial (lista não exaustiva; ver escopo completo):

- PDV, fiscal, comanda completa, contábil, RH  
- Estoque completo, cozinha profunda, delivery  
- Marketplace, app nativo, IA  
- Pagamento online obrigatório  
- Automação oficial de WhatsApp  

## 10. Critério de sucesso da visão

A documentação e a futura demo devem permitir a um gastrobar piloto responder “sim” a:

- “Consigo divulgar o evento e receber reservas sem planilha?”  
- “Consigo ver o que está acontecendo hoje sem abrir dez conversas?”  
- “Consigo evitar dois clientes no mesmo camarote?”  
- “Pagaria ~R$ 229,90/mês por isso?”  

## 11. Referências internas

- Escopo: [03_PRODUCT_SCOPE.md](03_PRODUCT_SCOPE.md)  
- MVP: [04_MVP_DEFINITION.md](04_MVP_DEFINITION.md)  
- Decisões: [18_PRODUCT_DECISIONS.md](18_PRODUCT_DECISIONS.md)  
- Estado: [20_PROJECT_STATE.md](20_PROJECT_STATE.md)  
