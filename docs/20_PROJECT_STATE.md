# 20 — Estado do Projeto

**Produto:** Gestor Camarote  
**Organização:** NTWS Labs  
**Atualizado em:** 2026-07-31  
**Repositório:** https://github.com/palexsfc10/gestor-camarote  

---

## 1. Fase atual

**Protótipo visual navegável** (frontend mock, sem backend), versionado neste repositório.

## 2. O que existe

- `docs/00`–`20` — produto  
- `docs/ux/00`–`18` — especificação UX  
- `docs/prototype/` — docs do protótipo  
- `web/` — app Next.js (App Router) com rotas `/demo/*`  
- `deploy/demo/` — artefatos de demo isolada (compose/Dockerfile) — **sem deploy automático**  
- Assets da demonstração em `web/public/perola/`  

## 3. O que NÃO existe

- Backend / FastAPI / banco / migrations  
- Auth real, pagamento, WhatsApp API, e-mail, IA  
- Deploy publicado neste passo de versionamento  
- OpenAPI definitivo  

## 4. Como rodar o protótipo

```bash
cd web
npm exec --yes pnpm@10 -- install
npm exec --yes pnpm@10 -- dev
```

Abrir http://localhost:3000/demo

Testes:

```bash
npm exec --yes pnpm@10 -- test
npm exec --yes pnpm@10 -- test:e2e   # requer browsers Playwright
npm exec --yes pnpm@10 -- build
```

## 5. Bloqueio

Arquitetura técnica e produto funcional **só com autorização explícita**.

## 6. Veredictos

| Camada | Veredicto |
|--------|-----------|
| Produto | Suficiente com ressalvas |
| UX | Aprovada com ressalvas |
| Protótipo | **Pronto para apresentação** com ressalvas |

## 7. Histórico

| Data | Mudança |
|------|---------|
| 2026-07-30 | Docs produto 00–20 |
| 2026-07-30 | Spec UX 00–18 |
| 2026-07-30–31 | Protótipo Pérola + refinamentos mobile/programação |
| 2026-07-31 | Versionamento inicial no GitHub (`main`) |
