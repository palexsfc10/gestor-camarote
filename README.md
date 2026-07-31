# Gestor Camarote — Plataforma Operacional para Bares e Gastrobares

Produto SaaS da **NTWS Labs** para bares, gastrobares, casas noturnas e estabelecimentos que operam com eventos, camarotes, mesas, aniversários, convidados, combos e reservas.

## Visão em uma frase

Uma plataforma digital para divulgar eventos, receber reservas, organizar camarotes, mesas, aniversários, convidados e preparar a operação da casa.

## Aviso importante — estado atual

Este repositório contém **documentação de produto/UX** e um **protótipo visual navegável**.

| Existe | Não existe |
|--------|------------|
| Frontend Next.js em `web/` | Backend / API |
| Dados **fictícios** (mock + sessionStorage) | Banco de dados |
| Rotas públicas e painel demo sob `/demo` | Auth real / pagamentos |
| Assets do Pérola usados na demonstração | Deploy de produção neste commit |

Tudo o que aparece na demo é **simulacro**. Não há dados reais de clientes.

## Estrutura

```text
gestor-camarote/
  docs/                 # Produto, UX e protótipo
  web/                  # App Next.js (App Router)
  deploy/demo/          # Automação VPS + compose da demo
  Makefile              # wrappers make demo-*
  README.md
```

## Deploy da demo (VPS — operador)

Scripts idempotentes em `deploy/demo/` para o operador na VPS (Cursor **não**
acessa a VPS). Documentação: [`deploy/demo/DEPLOY_AUTOMATION.md`](deploy/demo/DEPLOY_AUTOMATION.md).

```bash
sudo ./deploy/demo/preflight-vps.sh
sudo ./deploy/demo/deploy-vps.sh --dry-run <sha>
sudo ./deploy/demo/deploy-vps.sh <sha>
```

Hostname planejado: `perola-demo.ntws.cloud` · bind `127.0.0.1:3107`.
Cloudflare Tunnel continua configuração **manual** (uma vez).

## Stack e versões (protótipo)

| Item | Versão |
|------|--------|
| Next.js | 16.2.12 |
| React | 19.2.4 |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Vitest | 4.x |
| Playwright | 1.62.x |
| pnpm | 10.34.5 (via `packageManager`) |

## Como rodar o frontend

Requisitos: Node.js 20+ recomendado.

```bash
cd web
npm exec --yes pnpm@10 -- install
npm exec --yes pnpm@10 -- dev
```

Abrir [http://localhost:3000/demo](http://localhost:3000/demo).

Outros comandos:

```bash
cd web
npm exec --yes pnpm@10 -- lint
npm exec --yes pnpm@10 -- exec tsc --noEmit
npm exec --yes pnpm@10 -- test
npm exec --yes pnpm@10 -- test:e2e   # requer browsers Playwright + build
npm exec --yes pnpm@10 -- build
```

Use o seletor **Cliente / Painel da casa** e o botão **Reiniciar demonstração** para restaurar o estado mock.

## Rotas principais

| Rota | Superfície |
|------|------------|
| `/demo` | Home pública (Pérola) |
| `/demo/eventos` | Programação |
| `/demo/eventos/[slug]` | Página do evento |
| `/demo/reservar/[slug]` | Wizard de reserva |
| `/demo/reserva/[code]` | Acompanhamento |
| `/demo/admin` | Visão de hoje |
| `/demo/admin/reservas` | Filas de reservas |
| `/demo/admin/mapa` | Mapa de espaços |
| `/demo/admin/preparacao` | Preparação |

Mapa completo: [docs/prototype/02_ROUTE_MAP.md](docs/prototype/02_ROUTE_MAP.md).

## Documentação

### Produto (Fase 0)

| # | Documento |
|---|-----------|
| 00 | [Visão do produto](docs/00_PRODUCT_VISION.md) |
| 01 | [Problema e oportunidade](docs/01_PROBLEM_AND_OPPORTUNITY.md) |
| 02 | [Personas e JTBD](docs/02_PERSONAS_AND_JTBD.md) |
| 03 | [Escopo do produto](docs/03_PRODUCT_SCOPE.md) |
| 04 | [Definição do MVP](docs/04_MVP_DEFINITION.md) |
| 05 | [Requisitos funcionais](docs/05_FUNCTIONAL_REQUIREMENTS.md) |
| 06 | [Requisitos não funcionais](docs/06_NON_FUNCTIONAL_REQUIREMENTS.md) |
| 07 | [Fluxos de usuário](docs/07_USER_FLOWS.md) |
| 08 | [Regras de negócio](docs/08_BUSINESS_RULES.md) |
| 09 | [Modelo de domínio](docs/09_DOMAIN_MODEL.md) |
| 10 | [Status e máquinas de estado](docs/10_STATUS_AND_STATE_MACHINES.md) |
| 11 | [Segurança, privacidade e LGPD](docs/11_SECURITY_PRIVACY_LGPD.md) |
| 12 | [Diretrizes de UX](docs/12_UX_GUIDELINES.md) |
| 13 | [Critérios de aceite](docs/13_ACCEPTANCE_CRITERIA.md) |
| 14 | [Analytics e métricas](docs/14_ANALYTICS_AND_SUCCESS_METRICS.md) |
| 15 | [Roadmap](docs/15_ROADMAP.md) |
| 16 | [Riscos e mitigações](docs/16_RISKS_AND_MITIGATIONS.md) |
| 17 | [Questões abertas](docs/17_OPEN_QUESTIONS.md) |
| 18 | [Decisões de produto](docs/18_PRODUCT_DECISIONS.md) |
| 19 | [Script da demonstração](docs/19_DEMO_SCRIPT.md) |
| 20 | [Estado do projeto](docs/20_PROJECT_STATE.md) |

### UX

Ver índice em [docs/ux/00_UX_STRATEGY.md](docs/ux/00_UX_STRATEGY.md) e pasta `docs/ux/`.

### Protótipo

Ver [docs/prototype/00_PROTOTYPE_SCOPE.md](docs/prototype/00_PROTOTYPE_SCOPE.md) e pasta `docs/prototype/`.

## Limitações conhecidas

- Sem backend, banco, auth real ou integrações (WhatsApp, pagamento, e-mail).
- Estado da demo vive no `sessionStorage` do navegador.
- Isolamento por evento e fluxos Mesa/Camarote/Aniversário são de protótipo.
- Publicação VPS é **manual pelo operador** via `deploy/demo/deploy-vps.sh` (sem acesso remoto do Cursor).
- Materiais brutos locais do venue não entram no Git; assets da demo estão em `web/public/perola/`.

## Princípios-chave

1. Mobile-first — não parecer ERP  
2. Painel centrado em “O que está acontecendo hoje?”  
3. Mapa visual de espaços como peça central  
4. Sem confirmação automática antes da aprovação da casa  
5. Uma fonte de verdade para site e painel  
6. Multi-tenant desde o nascimento (produto)  
7. MVP prova utilidade operacional  

## Status da fase

**Fase 0 (produto)** concluída.  
**Especificação de UX** concluída.  
**Protótipo visual** disponível em `web/`.

Backend e produto funcional **somente com autorização explícita**.
