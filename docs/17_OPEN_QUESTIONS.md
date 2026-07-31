# 17 — Questões Abertas

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Uso:** validação humana / estabelecimento piloto  

---

## Como ler

| Campo | Significado |
|-------|-------------|
| Por que importa | Impacto se não decidir |
| Opções | Alternativas |
| Recomendação NTWS | Proposta atual |
| Responsável | Quem fecha |
| Validar com casa? | Sim/Não |

---

## OQ-001 — TTL de pré-reserva / solicitação

| | |
|--|--|
| **Pergunta** | Quanto tempo uma solicitação `solicitada` / `aguardando_*` segura o espaço? |
| **Por que importa** | Espaço preso demais perde venda; curto demais frustra |
| **Opções** | 2h / 6h / 12h / 24h / por tipo de espaço |
| **Recomendação** | 12h default, configurável por venue |
| **Impacto** | Alto operacional |
| **Responsável** | PO + gestor da casa |
| **Validar com casa** | Sim |

---

## OQ-002 — Política de CPF do gastrobar piloto

| | |
|--|--|
| **Pergunta** | A casa exige CPF em toda reserva ou aceita regra financeira condicional? |
| **Por que importa** | Atrito × controle |
| **Opções** | Sempre / só camarote / só com valor/sinal / nunca |
| **Recomendação** | Só com responsabilidade financeira (DEC-CPF-001) |
| **Impacto** | UX + LGPD |
| **Responsável** | Casa + PO |
| **Validar com casa** | Sim |

---

## OQ-003 — Telefone único por evento

| | |
|--|--|
| **Pergunta** | Bloquear segundo pedido ativo com o mesmo telefone? |
| **Por que importa** | Abuso vs. reservas legítimas múltiplas |
| **Opções** | Bloquear sempre / avisar / permitir / permitir só admin |
| **Recomendação** | Bloquear segunda ativa; admin pode override |
| **Impacto** | Médio |
| **Responsável** | PO + casa |
| **Validar com casa** | Sim |

---

## OQ-004 — Lista de espera segura espaço?

| | |
|--|--|
| **Pergunta** | Entrar em espera libera o espaço imediatamente? |
| **Por que importa** | Occupancy correctness |
| **Opções** | Libera sempre (rec.) / segura por TTL curto |
| **Recomendação** | Libera sempre |
| **Impacto** | Alto |
| **Responsável** | PO |
| **Validar com casa** | Sim (confirmação) |

---

## OQ-005 — Layout real dos 8 camarotes

| | |
|--|--|
| **Pergunta** | Qual a planta/ordem visual do gastrobar piloto? |
| **Por que importa** | Demo do mapa |
| **Opções** | Grade 2×4 / template custom NTWS / foto com pins depois |
| **Recomendação** | Template NTWS alinhado à planta real (D) |
| **Impacto** | Comercial na demo |
| **Responsável** | NTWS implantação + casa |
| **Validar com casa** | Sim |

---

## OQ-006 — Sinal: valores e processo atual

| | |
|--|--|
| **Pergunta** | Como a casa cobra sinal hoje (Pix manual, link, presencial)? |
| **Por que importa** | Desenho de `aguardando_sinal` |
| **Opções** | Só observação / status + valor / integração Pix (F5) |
| **Recomendação** | Status + valor + instrução textual no MVP |
| **Impacto** | Médio |
| **Responsável** | Casa |
| **Validar com casa** | Sim |

---

## OQ-007 — Comunicação ao cliente (canal)

| | |
|--|--|
| **Pergunta** | Além da página de status, haverá WhatsApp manual da casa? E-mail? |
| **Por que importa** | Expectativa e escopo de notificação |
| **Opções** | Só link / e-mail / WhatsApp manual / API depois |
| **Recomendação** | Link MUST; e-mail SHOULD; WhatsApp API WON’T NOW |
| **Impacto** | Médio |
| **Responsável** | PO + casa |
| **Validar com casa** | Sim |

---

## OQ-008 — Papéis jurídicos LGPD

| | |
|--|--|
| **Pergunta** | Contrato e textos: controlador = casa, operador = NTWS? |
| **Por que importa** | Compliance |
| **Opções** | Controlador/operador / controlador conjunto (avaliar) |
| **Recomendação** | Casa controlador, NTWS operador |
| **Impacto** | Alto legal |
| **Responsável** | Jurídico NTWS + casa |
| **Validar com casa** | Sim |

---

## OQ-009 — Retenção de dados

| | |
|--|--|
| **Pergunta** | 12 meses após evento é aceitável? |
| **Por que importa** | LGPD + histórico operacional |
| **Opções** | 6 / 12 / 24 meses |
| **Recomendação** | 12 meses piloto |
| **Impacto** | Médio |
| **Responsável** | Jurídico + casa |
| **Validar com casa** | Sim |

---

## OQ-010 — Nome comercial do produto

| | |
|--|--|
| **Pergunta** | “Gestor Camarote” é o nome definitivo? |
| **Por que importa** | Marca, domínio, demo |
| **Opções** | Manter / renomear |
| **Recomendação** | Manter como nome de trabalho até validação |
| **Impacto** | Baixo–médio |
| **Responsável** | NTWS Labs |
| **Validar com casa** | Não obrigatório |

---

## OQ-011 — Slug / subdomínio da demo

| | |
|--|--|
| **Pergunta** | Qual subdomínio em `ntws.cloud`? |
| **Por que importa** | Publicação F1 |
| **Opções** | nome-da-casa.ntws.cloud / gestor-camarote.ntws.cloud / outro |
| **Recomendação** | slug do venue piloto |
| **Impacto** | Baixo |
| **Responsável** | NTWS |
| **Validar com casa** | Preferível |

---

## OQ-012 — Usar `em_atendimento`?

| | |
|--|--|
| **Pergunta** | Precisa distinguir chegou vs em atendimento? |
| **Por que importa** | Complexidade de estados |
| **Opções** | Sim / Não (fundir) |
| **Recomendação** | Não no MVP; só `cliente_chegou` → `finalizada` |
| **Impacto** | Baixo–médio |
| **Responsável** | PO |
| **Validar com casa** | Opcional |

---

## OQ-013 — Lista de convidados sem espaço físico

| | |
|--|--|
| **Pergunta** | A casa usa lista de pista separada de mesa/camarote? |
| **Por que importa** | Escopo FR-GUEST / tipos |
| **Opções** | Sim no MVP / só aniversário / depois |
| **Recomendação** | Aniversário first; lista genérica SHOULD se a casa usar |
| **Impacto** | Médio |
| **Responsável** | Casa + PO |
| **Validar com casa** | Sim |

---

## OQ-014 — Horário limite de chegada

| | |
|--|--|
| **Pergunta** | Existe horário limite real hoje? Quem marca no-show? |
| **Por que importa** | BR-POL-002 |
| **Opções** | Por tipo / por evento / só manual sem horário |
| **Recomendação** | Campo opcional + marcação humana |
| **Impacto** | Médio |
| **Responsável** | Casa |
| **Validar com casa** | Sim |

---

## OQ-015 — Catálogo: o que entra na demo

| | |
|--|--|
| **Pergunta** | Quais bebidas/combos/pacote aniversário reais usar no script? |
| **Por que importa** | Credibilidade da demo |
| **Opções** | Cardápio real / fictício anonimizado |
| **Recomendação** | Itens reais ou realistas aprovados pela casa |
| **Impacto** | Comercial |
| **Responsável** | Casa + NTWS |
| **Validar com casa** | Sim |

---

## OQ-016 — E-mail transacional no MVP

| | |
|--|--|
| **Pergunta** | Enviar e-mail em solicitação/confirmação? |
| **Por que importa** | Escopo F1 |
| **Opções** | Sim / não / só confirmação |
| **Recomendação** | Página de status MUST; e-mail SHOULD se custo baixo |
| **Impacto** | Médio |
| **Responsável** | PO + eng (quando autorizado) |
| **Validar com casa** | Não |

---

## OQ-017 — Preço de assinatura

| | |
|--|--|
| **Pergunta** | R$ 229,90/mês é o preço a testar rigidamente? |
| **Por que importa** | Validação comercial |
| **Opções** | Manter / faixa / setup fee + mensal |
| **Recomendação** | Testar 229,90; anotar objeções |
| **Impacto** | Comercial |
| **Responsável** | Comercial NTWS |
| **Validar com casa** | Sim (disposição) |

---

## Resumo

**Devem ser fechadas antes do piloto com dados reais:** OQ-002, OQ-005, OQ-008, OQ-009, OQ-015.  
**Antes da demo F1:** OQ-001, OQ-005, OQ-006, OQ-011, OQ-015.  
**Podem ficar em aberto com default:** OQ-012, OQ-016, OQ-010.
