# 06 — Requisitos Não Funcionais

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  

IDs: NFR-\<ÁREA\>-\<NNN\>

---

## 1. Disponibilidade

### NFR-AVAIL-001
O painel e o site público do tenant piloto devem ter disponibilidade alvo de **99% mensal** no ambiente da demo/piloto (excluindo manutenções anunciadas).

### NFR-AVAIL-002
Manutenções planejadas devem ser comunicáveis e preferencialmente fora do pico noturno do estabelecimento (ex.: manhãs de dia útil).

### NFR-AVAIL-003
Em falha parcial, o sistema deve falhar de forma segura: **não confirmar** ocupação ambígua de espaço.

---

## 2. Performance

### NFR-PERF-001
Página pública do evento (mobile, 4G moderado simulado): **LCP ≤ 3,5 s** no percentil 75 da demo.

### NFR-PERF-002
Envio de solicitação de reserva: resposta de aceite/erro em **≤ 3 s** no p95 sob carga do piloto.

### NFR-PERF-003
Visão de hoje e mapa do evento ativo: carregamento inicial útil em **≤ 2,5 s** no p95 (rede interna boa).

### NFR-PERF-004
Atualização do painel após ação local: UI otimista ou refresh refletindo persistência em **≤ 2 s**.

### NFR-PERF-005
Polling/SSE do painel operacional: intervalo recomendado de **5–15 s** no MVP; mudanças críticas via refresh pós-ação não dependem só do poll.

---

## 3. Tempo real (proporcional)

### NFR-RT-001
O MVP **não exige** WebSocket. Abordagem recomendada: **polling curto** ou **SSE** unidirecional para fila/mapa.

### NFR-RT-002
Objetivo de frescor: outros operadores veem nova solicitação em **≤ 15 s** na configuração padrão.

### NFR-RT-003
A consistência de ocupação **não** depende de tempo real de UI; depende do **banco como fonte de verdade** (NFR-CONC).

---

## 4. Segurança

### NFR-SEC-001
Todas as rotas administrativas exigem autenticação e autorização por papel.

### NFR-SEC-002
Todas as consultas/mutações são escopadas ao tenant; testes de isolamento são obrigatórios.

### NFR-SEC-003
Senhas armazenadas com hash forte; segredos fora do código.

### NFR-SEC-004
Proteção CSRF em cookies de sessão (se aplicável) e validação de origem.

### NFR-SEC-005
Rate limit em endpoints públicos de reserva e em autenticação.

### NFR-SEC-006
CAPTCHA ou Cloudflare Turnstile no envio público de solicitação (SHOULD/MUST se abuso aparecer).

### NFR-SEC-007
Tokens de acompanhamento de reserva: opacos, longos, não enumeráveis.

### NFR-SEC-008
Cabeçalhos de segurança básicos (HTTPS obrigatório em produção).

### NFR-SEC-009
Upload de imagens: validação de tipo/tamanho; sem execução de conteúdo.

---

## 5. Privacidade e LGPD

Detalhe em [11_SECURITY_PRIVACY_LGPD.md](11_SECURITY_PRIVACY_LGPD.md).

### NFR-PRIV-001
Coleta mínima alinhada à finalidade operacional.

### NFR-PRIV-002
Mascaramento de CPF no painel por padrão; revelação explícita com log (SHOULD).

### NFR-PRIV-003
Política de retenção e caminho de anonimização documentados antes do piloto com dados reais.

### NFR-PRIV-004
Base legal e aviso de privacidade no fluxo público.

---

## 6. Multi-tenancy

### NFR-MT-001
Isolamento lógico por Organization/Venue desde a primeira versão.

### NFR-MT-002
Nenhum identificador previsível de outro tenant deve retornar dados (ex.: IDOR).

### NFR-MT-003
Jobs/cron (expiração) processam por tenant sem vazamento cruzado.

---

## 7. Auditoria

### NFR-AUD-001
Ações críticas geram AuditLog imutável (append-only lógico).

### NFR-AUD-002
Histórico de status de reserva completo para trilha operacional.

### NFR-AUD-003
Retenção de logs de auditoria ≥ retenção operacional acordada (proposta: 12 meses no piloto).

---

## 8. Backup e recuperação

### NFR-BK-001
Backup automático diário do banco no ambiente piloto/produção.

### NFR-BK-002
RPO alvo piloto: **≤ 24 h**; RTO alvo piloto: **≤ 8 h** (ajustar depois).

### NFR-BK-003
Teste de restore documentado ao menos uma vez antes de piloto com dados reais.

---

## 9. Observabilidade

### NFR-OBS-001
Logs estruturados com requestId, tenantId, userId (quando houver).

### NFR-OBS-002
Métricas: taxa de erro, latência p95, contagem de reservas, conflitos de ocupação.

### NFR-OBS-003
Alertas para erro 5xx sustentado e falha de job de expiração.

---

## 10. Responsividade e mobile

### NFR-UX-001
Fluxos públicos e operacionais usáveis em viewport **≥ 360 px** de largura.

### NFR-UX-002
Alvos de toque ≥ 44 px nas ações críticas de recepção/mapa.

### NFR-UX-003
Painel operacional prioriza mobile; gestão de conteúdo pode otimizar desktop.

---

## 11. Acessibilidade

### NFR-A11Y-001
Contraste adequado em status do mapa (não só cor: ícone/texto).

### NFR-A11Y-002
Formulários com labels; erros anunciáveis.

### NFR-A11Y-003
Meta MVP: WCAG 2.1 AA nos fluxos públicos principais (objetivo; auditar na fase UX).

---

## 12. Compatibilidade

### NFR-COMPAT-001
Suporte: 2 últimas versões major de Chrome, Safari iOS, Chrome Android.

### NFR-COMPAT-002
Não depender de APIs exclusivas de desktop no fluxo do cliente.

---

## 13. Concorrência e consistência

### NFR-CONC-001
O banco é a fonte de verdade para ocupação de EventSpace.

### NFR-CONC-002
Constraint de unicidade / bloqueio otimista ou transação serializável no ponto de pré-reserva/confirmação.

### NFR-CONC-003
Em conflito, exatamente uma solicitação obtém o espaço; a outra recebe erro de indisponibilidade **sem** estado confirmado fantasma.

### NFR-CONC-004
Leituras do site podem ser eventual consistency curta (**≤ 5 s**), desde que mutações de reserva sejam strong consistency no commit.

---

## 14. Idempotência

### NFR-IDEM-001
POST público de reserva aceita `Idempotency-Key` (ou equivalente) com retenção mínima de 24 h.

### NFR-IDEM-002
Botões de confirmação admin evitam double-submit (UI + servidor).

---

## 15. Escalabilidade

### NFR-SCALE-001
Arquitetura multi-tenant preparada para N venues; demo com 1.

### NFR-SCALE-002
MVP dimensionado para: dezenas de eventos/mês por venue; centenas de reservas/evento no pico do piloto — sem overengineering.

### NFR-SCALE-003
Uploads de mídia em storage objeto, não no banco.

---

## 16. Comportamento em conexão instável

### NFR-NET-001
Envio de reserva: feedback claro de sucesso/erro; retry seguro via idempotência.

### NFR-NET-002
Painel: se poll falhar, indicar “dados podem estar desatualizados” e permitir refresh manual.

### NFR-NET-003
Ações de check-in: confirmar persistência antes de feedback definitivo de sucesso.

---

## 17. Internacionalização

### NFR-I18N-001
MVP em **pt-BR** apenas (WON’T NOW multi-idioma).

---

## 18. Preparação para IA (sem IA agora)

### NFR-AI-READY-001
Eventos de domínio e audit devem ser estruturados o suficiente para futuras análises (ex.: no-show, conversão) sem implementar modelos agora.
