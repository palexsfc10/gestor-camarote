# 02 — Personas e Jobs-to-be-Done

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

---

## 1. Visão geral das personas

| ID | Persona | Lado | Acesso típico |
|----|---------|------|---------------|
| P1 | Dono / gestor da casa | Admin | Configuração + visão gerencial leve |
| P2 | Administrador de reservas | Admin | Decisão sobre solicitações |
| P3 | Equipe de recepção | Admin (limitado) | Check-in, mapa, chegada |
| P4 | Equipe de preparação | Admin (limitado) | Lista de preparação |
| P5 | Cliente responsável pela reserva | Público | Solicitação e status |
| P6 | Aniversariante | Público / híbrido | Pacote e convidados |
| P7 | Convidado | Público | Lista / presença |

---

## 2. Personas detalhadas

### P1 — Dono ou gestor da casa

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Maximizar ocupação de espaços; controlar imagem da casa; ter visão do que acontece; padronizar operação |
| **Dores** | Depender de uma pessoa-chave no WhatsApp; não saber se a noite está vendida; inconsistência de preços/promoções |
| **Tarefas** | Definir eventos, preços, regras; acompanhar indicadores leves; aprovar políticas; revisar preparação comercial |
| **Contexto de uso** | Escritório ou celular, diurno e pré-evento; raramente na porta |
| **Nível de acesso** | Total do tenant (venue) |
| **Dispositivo** | Desktop + mobile |
| **Riscos** | Pedir “ERP completo”; sobrecarregar o produto com desejos |
| **Necessidades de UI** | Visão de hoje clara; configuração simples; sem jargão técnico |

**JTBD:** *Quando vou divulgar a programação da casa, quero cadastrar o evento uma vez e ver site/calendário atualizados, para não retrabalhar em três canais.*

---

### P2 — Administrador de reservas

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Analisar solicitações rápido; confirmar/recusar sem erro; negociar espaço/sinal; manter fila limpa |
| **Dores** | Mensagens paralelas; risco de confirmar o mesmo camarote duas vezes; falta de histórico da solicitação |
| **Tarefas** | Triagem; confirmação; recusa; espera; pedido de sinal/info; troca de espaço; observações internas |
| **Contexto de uso** | Celular e desktop; picos após posts no Instagram |
| **Nível de acesso** | Reservas, eventos, clientes leves, mapa; sem (ou com limite) em billing/config crítica |
| **Dispositivo** | Mobile primeiro |
| **Riscos** | Confirmar sem olhar capacidade; esquecer sinal; observação só no WhatsApp |
| **Necessidades de UI** | Fila de pendências; ações em poucos toques; alerta de conflito |

**JTBD:** *Quando chega uma solicitação, quero ver espaço, pessoas, adicionais e risco, e decidir em poucos toques, para não deixar o cliente no vácuo nem duplicar reserva.*

---

### P3 — Equipe de recepção

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Identificar quem chegou; liberar entrada; marcar no-show; reduzir fila |
| **Dores** | Lista em papel desatualizada; nomes incompletos; telefone ilegível; não saber se pagou sinal |
| **Tarefas** | Consultar mapa/lista; registrar chegada; observações de porta; no-show |
| **Contexto de uso** | Porta/entrada, noite, barulho, pressa, luz baixa |
| **Nível de acesso** | Operação do dia: mapa, check-in, consulta de reserva; sem editar preços/eventos |
| **Dispositivo** | Mobile / tablet |
| **Riscos** | Expor dados sensíveis na tela; marcar chegada errada |
| **Necessidades de UI** | Fonte grande; busca por nome/telefone; status visual; mascaramento de CPF |

**JTBD:** *Quando a pessoa chega na porta, quero achar a reserva em segundos e marcar chegada, para não travar a fila.*

---

### P4 — Equipe de preparação

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Saber o que preparar, para quem, até quando |
| **Dores** | Pedidos espalhados; mudança de status sem aviso; quantidade total desconhecida |
| **Tarefas** | Ver consolidado; marcar em preparação/pronto/entregue; ver observações |
| **Contexto de uso** | Bar/cozinha/apoio; mãos ocupadas; mobile |
| **Nível de acesso** | Preparação do evento/dia; leitura de reserva relacionada |
| **Dispositivo** | Mobile / tablet |
| **Riscos** | Preparar item cancelado; entregar no espaço errado |
| **Necessidades de UI** | Lista clara; filtros por status; consolidado por item + detalhe por reserva |

**JTBD:** *Antes e durante o evento, quero ver o que precisa estar pronto por horário/espaço, para não improvisar na hora.*

---

### P5 — Cliente responsável pela reserva

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Garantir espaço; entender regras e valores; acompanhar se foi aceito |
| **Dores** | Demora no WhatsApp; não saber se está confirmado; medo de pagar e não ter mesa |
| **Tarefas** | Escolher modalidade/espaço; informar dados; pessoas; adicionais; enviar; acompanhar status |
| **Contexto de uso** | Mobile, vindo do Instagram/WhatsApp |
| **Nível de acesso** | Público autenticado por link/token da solicitação (MVP) |
| **Dispositivo** | Mobile |
| **Riscos** | Abandonar por formulário longo; cadastrar CPF sem necessidade; achar que já está confirmado |
| **Necessidades de UI** | Linguagem clara “solicitação ≠ confirmação”; poucos campos; status explícito |

**JTBD:** *Quando vejo o post do evento, quero pedir meu camarote/mesa pelo link e saber se a casa aceitou, sem ficar caçando resposta no direct.*

---

### P6 — Aniversariante

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Comemorar com pacote; controlar convidados; ter nome/decoração corretos |
| **Dores** | Lista de convidados no WhatsApp; limite estourado; benefício do pacote esquecido pela casa |
| **Tarefas** | Escolher pacote; cadastrar dados; convidar; acompanhar confirmações (MVP parcial) |
| **Contexto de uso** | Mobile, dias antes do evento |
| **Nível de acesso** | Fluxo de aniversário + link de convidados (conforme escopo MVP) |
| **Dispositivo** | Mobile |
| **Riscos** | Expectativa de QR/check-in avançado cedo demais |
| **Necessidades de UI** | Fluxo dedicado simples; benefícios do pacote visíveis |

**JTBD:** *Quando vou comemorar meu aniversário na casa, quero um pacote claro e uma lista de convidados compartilhável, para não gerenciar tudo no zap.*

---

### P7 — Convidado

| Campo | Conteúdo |
|-------|----------|
| **Objetivos** | Entrar na lista; informar se vai; saber regras de entrada |
| **Dores** | Link quebrado; não saber se está na lista; dados excessivos |
| **Tarefas** | Abrir link; informar nome (e opcionalmente acompanhante); confirmar presença (evolução) |
| **Contexto de uso** | Mobile, rápido |
| **Nível de acesso** | Link público/compartilhável limitado |
| **Dispositivo** | Mobile |
| **Riscos** | Coleta excessiva; spam de lista |
| **Necessidades de UI** | Mínimo de campos; confirmação de que entrou na lista |

**JTBD:** *Quando recebo o link do aniversário, quero me colocar na lista em poucos segundos, para garantir entrada sem burocracia.*

---

## 3. Matriz Job × Capacidade do produto

| Job | Capacidade MVP | Evolução |
|-----|----------------|----------|
| Publicar evento uma vez | Sim | Recorrência |
| Solicitar reserva pelo link | Sim | — |
| Decidir solicitações | Sim | Regras automáticas leves |
| Ver mapa da noite | Sim (template) | Editor visual avançado |
| Preparar itens | Sim | Integração cozinha |
| Lista de convidados aniversário | Parcial | RSVP + QR |
| Pagar sinal online | Não | Fase pagamentos |
| CRM profundo | Não | Histórico leve apenas |

## 4. Implicações de design

1. **Dois produtos em um shell:** site público (conversão) + painel operacional (velocidade).
2. **Recepção e preparação** exigem UI “noite”: contraste, toque grande, busca rápida.
3. **Cliente** nunca deve interpretar “enviado” como “confirmado”.
4. **Permissões** devem refletir personas (ver FR-AUTH e decisões).

## 5. Personas fora de escopo inicial

- Contador / fiscal  
- Cozinha full (KDS)  
- Fornecedor  
- Marketplace buyer genérico  
- Operador de IA  

---

Referências: [12_UX_GUIDELINES.md](12_UX_GUIDELINES.md), [07_USER_FLOWS.md](07_USER_FLOWS.md).
