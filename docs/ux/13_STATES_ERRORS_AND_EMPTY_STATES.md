# UX 13 — Estados, Erros e Empty States

**Produto:** Gestor Camarote  
**Tom:** objetivo, humano, sem culpar o usuário  

---

## 1. Catálogo de estados globais

| Estado | Onde | Mensagem sugerida | Ação |
|--------|------|-------------------|------|
| **Carregando** | Listas/páginas | Skeleton / “Carregando…” | — |
| **Vazio** | Listas | Ver tabela empty abaixo | CTA contextual |
| **Sucesso** | Toast | Curta e específica | Auto-dismiss 4s |
| **Erro** | Toast/inline | O que falhou + o que fazer | Retry se seguro |
| **Sem conexão** | Banner sticky | “Sem conexão. Ações não foram enviadas.” | Tentar de novo |
| **Conexão lenta** | Banner leve | “Conexão lenta. Atualizações podem demorar.” | — |
| **Conflito de reserva** | Modal | “Esse espaço acabou de ficar indisponível. Escolha outro.” | Ir aos espaços |
| **Sessão expirada** | Modal bloqueante | “Sua sessão expirou. Entre novamente.” | Login |
| **Evento cancelado** | PUB-03 | “Este evento foi cancelado pela casa.” | Ver outros |
| **Evento encerrado** | PUB-03 | “Este evento já foi encerrado.” | Ver próximos |
| **Espaço indisponível** | PUB-05/09 | Igual conflito | Relistar |
| **Item esgotado** | PUB-08 | “Item esgotado” (disabled) | — |
| **Acesso negado** | Página | “Você não tem permissão para esta ação.” | Voltar |
| **Dados atualizados por outro** | Toast | “Esta reserva foi atualizada por outro usuário. Recarregamos os dados.” | — |
| **Rate limit** | PUB-09 | “Aguarde um momento e tente de novo.” | Esperar |
| **Turnstile falhou** | PUB-09 | “Não foi possível validar o envio. Atualize e tente novamente.” | Retry |
| **TTL / expirada** | PUB-10 | “Esta solicitação expirou. Você pode enviar uma nova.” | Nova |
| **Lista cheia (aniversário)** | PUB-11 | “A lista atingiu o limite do pacote.” | — |

---

## 2. Empty states

| Tela | Mensagem | CTA |
|------|----------|-----|
| PUB-01 sem eventos | “Em breve novos eventos.” | — / redes |
| ADM-01 sem evento hoje | “Não há evento hoje.” | Próximos / Criar |
| ADM-02 sem reservas | “Nenhuma reserva neste filtro.” | Limpar filtros |
| ADM-05 sem espaços | “Nenhum espaço neste evento.” | Configurar evento |
| ADM-06/07 sem prep | “Nada para preparar ainda. Itens aparecem após confirmação.” | Ver reservas |
| ADM-12 sem itens | “Cadastre bebidas, comidas ou pacotes.” | Novo item |
| ADM-15 sem clientes | “Busque por nome ou telefone após as primeiras reservas.” | — |

---

## 3. Toasts de sucesso (exemplos)

| Ação | Toast |
|------|-------|
| Solicitação enviada | “Solicitação enviada. Aguarde a análise da casa.” |
| Confirmada | “Reserva confirmada.” |
| Recusada | “Solicitação recusada. Espaço liberado.” |
| Chegada | “Chegada registrada.” |
| Prep pronto | “Item marcado as pronto.” |
| Evento publicado | “Evento publicado no site.” |
| Item salvo | “Item salvo.” |

Nunca: “Reserva confirmada” no envio público.

---

## 4. Prevenção de erro

- Double-submit: botão loading + idempotency.  
- Ações críticas: modal com consequências.  
- Sair do wizard com dados: “Sair e perder o progresso?” SHOULD.  
- Troca de espaço: só destinos válidos no select.  

---

## 5. Consistência visual de status (chips)

Usar mesmos rótulos do doc 10 de produto (linguagem cliente) no admin e no público, com nível de detalhe maior no admin (código interno em tooltip COULD).
