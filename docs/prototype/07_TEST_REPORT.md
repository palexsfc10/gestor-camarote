# Prototype 07 — Relatório de Testes

## Vitest

Comando: `npm exec pnpm@10 -- test` (em `web/`)

| Suite | Resultado |
|-------|-----------|
| mock seed coherence | passed |
| utils format/mask | passed |
| SpaceStatusBadge textual | passed |

**5 tests passed** (2026-07-30).

## Playwright

Config: `web/playwright.config.ts`  
Specs: `web/e2e/demo.spec.ts`

Cobertura pretendida:

- navegação cliente ↔ admin  
- confirmação Mariana + mapa/prep  
- wizard em espaço disponível + mensagem de solicitação  

Execução: `npm exec pnpm@10 -- test:e2e` (requer browsers Playwright instalados).

## Não testado (fora de escopo)

API, banco, auth real, integração externa.
