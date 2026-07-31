# 01 — Problema e Oportunidade

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

---

## 1. Problema

Bares, gastrobares e casas noturnas vendem experiências (camarotes, mesas, aniversários, listas) principalmente por Instagram, WhatsApp e boca a boca. A operação tipicamente depende de:

- mensagens dispersas;
- planilhas;
- anotações manuais;
- memória da equipe;
- confirmações verbais ou por print.

### 1.1 Dores concretas

| Dor | Impacto |
|-----|---------|
| Reservas duplicadas no mesmo espaço | Conflito na porta, prejuízo de reputação |
| Confirmação prematura ao cliente | Expectativa quebrada, briga operacional |
| Sem visão unificada da noite | Equipe reativa, fila, improviso |
| Cardápio/combos/preços desatualizados em canais diferentes | Retrabalho e informação inconsistente |
| Preparação de bebidas/comida sem consolidação | Atraso, falta de item, estresse |
| Aniversários e convidados em listas paralelas | Entrada confusa, limite ignorado |
| Histórico inexistente ou excessivo | Ou caos, ou “CRM” pesado demais |

### 1.2 Causa raiz (hipótese)

Não falta “mais um site”. Falta um **sistema operacional leve** que una:

1. divulgação pública (evento + disponibilidade);
2. solicitação estruturada;
3. decisão humana da casa;
4. ocupação visual dos espaços;
5. preparação antecipada;
6. acompanhamento do dia.

## 2. Oportunidade

### 2.1 Segmento

Estabelecimentos com:

- eventos recorrentes ou sazonais;
- espaços reserváveis (camarotes, mesas, VIP, bistrô);
- demanda via redes sociais;
- equipe pequena/média na operação noturna;
- necessidade de organizar aniversários e listas.

### 2.2 Momento

- Digitalização de reservas ainda improvisada em muitas casas.
- WhatsApp Business sozinho não resolve conflito de espaço nem mapa operacional.
- ERPs/PDVs são pesados e não resolvem bem a jornada “link → solicitação → noite”.
- Preço acessível (~R$ 229,90/mês) pode caber em casas que já perdem receita por desorganização.

### 2.3 Hipótese de valor

> Se a casa publicar eventos e receber reservas em um único painel com mapa e preparação, então reduzirão conflitos, mensagens manuais e tempo de resposta — e estarão dispostas a pagar uma assinatura mensal.

## 3. Alternativas atuais (como o mercado resolve hoje)

| Alternativa | Limite |
|-------------|--------|
| WhatsApp + planilha | Escala mal; conflito; sem status claro |
| Instagram DM | Mesmo problema; sem estruturação |
| Formulário genérico (Google Forms etc.) | Não evita duplicidade de espaço; não opera a noite |
| Site institucional estático | Divulga, mas não opera |
| PDV/ERP | Caro, complexo; foco fiscal/estoque, não jornada de reserva social |
| Sistemas de ingresso/ticket | Úteis para pista/ingresso; fracos para camarote+preparação+mapa da casa |

## 4. Oportunidade de produto NTWS

Entregar um SaaS vertical que:

- nasce multi-tenant;
- démóável em subdomínio `ntws.cloud`;
- prova valor com **um** gastrobar conhecido;
- prioriza operação da noite, não contabilidade;
- compartilha dados entre site público e painel.

## 5. Não-oportunidade (nesta fase)

Não competir em:

- marketplace de bares;
- app nativo do consumidor;
- pagamento online como obrigação;
- IA de recomendação;
- automação oficial WhatsApp Business API (pode ser fase futura).

## 6. Evidências necessárias no piloto

Para validar a oportunidade (não apenas a ideia):

1. Eventos reais cadastrados no sistema.
2. Reservas reais recebidas pelo fluxo público.
3. Confirmações sem conflito de espaço.
4. Uso do painel “hoje” na noite do evento.
5. Feedback qualitativo da equipe.
6. Indicação de disposição a pagar.

Métricas em [14_ANALYTICS_AND_SUCCESS_METRICS.md](14_ANALYTICS_AND_SUCCESS_METRICS.md).

## 7. Riscos da oportunidade

Ver [16_RISKS_AND_MITIGATIONS.md](16_RISKS_AND_MITIGATIONS.md). Principais:

- casa continua no WhatsApp por hábito;
- mapa visual insuficiente na demo;
- coleta de CPF/dados gera atrito;
- expectativa de “ERP completo” pelo cliente.

## 8. Conclusão

Há problema real, recorrente e caro em reputação/operação. A oportunidade é um produto **estreito e profundo** na jornada evento → reserva → noite — não um ERP largo e raso.
