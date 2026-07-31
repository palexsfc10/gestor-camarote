# 03 — Escopo do Produto

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

---

## 1. Declaração de escopo

O produto cobre o ciclo **divulgação de evento → solicitação de reserva → decisão da casa → preparação → operação da noite → histórico leve**, para estabelecimentos multi-tenant, com site/calendário público e painel administrativo compartilhando a mesma fonte de dados.

## 2. Dentro do escopo (produto)

### 2.1 Núcleo operacional

- Gestão de estabelecimento (venue) e usuários
- Espaços físicos configuráveis por tipo (camarote, mesa, bistrô, VIP, etc.)
- Eventos (criar, editar, duplicar, publicar, despublicar, cancelar, reagendar, arquivar)
- Disponibilidade de espaços por evento
- Solicitações e reservas
- Tipos de reserva (ver regras)
- Status e rastreabilidade
- Mapa visual operacional (abordagem MVP definida nas decisões)
- Painel “Visão de hoje”
- Preparação antecipada de itens
- Check-in / chegada / no-show / finalização
- Observações internas
- Histórico operacional leve

### 2.2 Experiência pública

- Página pública do estabelecimento
- Calendário de eventos
- Página do evento
- Fluxo de solicitação de reserva
- Acompanhamento de status pelo cliente
- Fluxo de aniversário (MVP parcial)
- Lista de convidados (MVP parcial)

### 2.3 Catálogo

- Bebidas, comidas, porções, combos, pacotes, decoração, bolo, brindes, serviços, experiências
- Preços, disponibilidade, destaque, vínculo a eventos
- Uso no site, na reserva e na preparação
- **Sem** estoque completo

### 2.4 Plataforma

- Multi-tenancy
- Auditoria de ações críticas
- Proteções básicas contra abuso (rate limit, idempotência, CAPTCHA/Turnstile)
- Personalização leve da página pública (nome, logo, cores, imagens, contato, redes)

## 3. Fora do escopo (produto / MVP e adjacências explícitas)

| Área | Status |
|------|--------|
| PDV | Fora |
| Emissão fiscal | Fora |
| Comanda completa | Fora |
| Gestão contábil | Fora |
| Folha de pagamento | Fora |
| Controle completo de estoque | Fora |
| Integração profunda com cozinha (KDS) | Fora |
| Delivery | Fora |
| Gestão de fornecedores | Fora |
| Marketplace de bares | Fora |
| Aplicativo nativo | Fora |
| Inteligência artificial | Fora (preparar dados/eventos futuros) |
| Pagamento online obrigatório | Fora do MVP |
| Automação oficial de WhatsApp | Fora do MVP |
| Page builder complexo | Fora |
| Eventos recorrentes automáticos | Fora do MVP (roadmap) |
| QR Code de entrada avançado | Evolução |
| CRM / fidelidade profunda | Fora |

## 4. Escopo por ator

| Ator | Pode |
|------|------|
| Público | Ver site/eventos; solicitar; acompanhar status; (parcial) lista aniversário |
| Admin reservas | Decidir reservas; editar observações; alterar espaço; sinal manual |
| Recepção | Consultar; check-in; no-show |
| Preparação | Atualizar status de preparação |
| Gestor | Configurar venue, espaços, catálogo, página pública, usuários |

## 5. Escopo de dados

### Coletados quando necessários

Nome, telefone/WhatsApp, e-mail (conforme regra), quantidade de pessoas, horário previsto, observações, tipo de comemoração, CPF conforme política (ver decisões), convidados.

### Não coletados no MVP (salvo decisão futura)

Documentos além de CPF quando aplicável; biometria; geolocalização contínua; dados de cartão no produto (sem gateway).

## 6. Escopo de implantação da demo

- Um estabelecimento piloto (gastrobar conhecido)
- Tenant único na prática, arquitetura multi-tenant
- Publicação possível em subdomínio `ntws.cloud`
- Conteúdo de demo: eventos, 8 camarotes, catálogo amostral, fluxo completo do script

## 7. Limites de personalização

**Permitido:** branding leve (logo, cores, imagens, textos de contato).  
**Não permitido no MVP:** builder de páginas, temas ilimitados, widgets arbitrários, multi-idioma completo (avaliar depois).

## 8. Integrações

| Integração | MVP |
|------------|-----|
| Instagram/WhatsApp (como canal de link) | Sim (passivo: usuário cola o link) |
| WhatsApp Business API | Não |
| Gateway de pagamento | Não |
| E-mail transacional | SHOULD (status) — validar |
| SMS | Não |
| IA | Não |
| Cloudflare Turnstile / CAPTCHA | SHOULD |

## 9. Critério de fronteira

Se um recurso não ajuda a responder **“O que está acontecendo hoje?”** ou **“Como o cliente solicita e a casa decide sem conflito?”**, ele é candidato a fora do MVP.

---

Ver também: [04_MVP_DEFINITION.md](04_MVP_DEFINITION.md), [18_PRODUCT_DECISIONS.md](18_PRODUCT_DECISIONS.md).
