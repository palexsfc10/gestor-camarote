# Prototype 00 — Escopo do Protótipo

**Produto:** Gestor Camarote  
**Casa fictícia:** Pérola Gastrobar  
**Evento:** Pagode do Piska  
**Data da build:** 2026-07-30  

---

## 1. O que é

Protótipo visual navegável (Next.js) com **dados fictícios** e **estado local React**.  
Objetivo: validar aparência, clareza, fluxo, responsividade, percepção de valor e demo comercial.

## 2. Autorizado

- Frontend Next.js App Router  
- UI com Tailwind + componentes estilo shadcn/Radix  
- Mock + Context  
- Testes essenciais (Vitest + Playwright)  
- Documentação em `docs/prototype/`  

## 3. Proibido nesta fase

Backend, FastAPI, banco, migrations, auth real, pagamento, WhatsApp API, e-mail, IA, infra de produção, deploy, OpenAPI definitivo, `ntws.cloud`.

## 4. Conflitos resolvidos na implementação

| Conflito | Resolução no protótipo |
|----------|------------------------|
| C07 “disponível” vs reserva Mariana | C07 inicia **pré-reservado** por RES-007 (coerência operacional). Wizard usa C02/C08 para nova solicitação. |
| Rotas UX `/{slug}` vs pedido `/demo` | Prefixo `/demo` para deixar claro que é demonstração |
| “Aguardando sinal” no mapa | Alerta da **reserva**; espaço permanece `pre_reservado` |
| pnpm global indisponível no host | Uso via `npm exec pnpm@10` |

## 5. Versões registradas

Ver `01_DESIGN_SYSTEM.md` e `web/package.json`.
