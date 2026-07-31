# Status do deploy Pérola Demo — PARADO (controle)

Data: 2026-07-31

## Decisão

**STOP antes de alterações na VPS.** Artefatos locais preparados; publicação remota
bloqueada por falta de inventário seguro e pré-requisitos.

## Bloqueios

1. **Docker Desktop local**: daemon indisponível (`dockerDesktopLinuxEngine` não encontrado). Imagem não construída/iniciada nesta máquina.
2. **Inventário VPS**: host SSH / acesso ao Tunnel não confirmados neste ambiente sem expor credenciais. Sem `docker ps` remoto, não é possível garantir ausência de conflito na porta `3107` ou em `/srv/docker/perola-demo`.
3. **Git**: repositório em `web/` na branch `master`, SHA base `75449c2` (commit inicial Create Next App). Grande parte do protótipo ainda **untracked** — não há release tag/commit único do protótipo.

## Artefatos prontos (locais)

| Item | Caminho |
| --- | --- |
| Dockerfile multi-stage | `web/Dockerfile` |
| .dockerignore | `web/.dockerignore` |
| Compose monorepo | `deploy/demo/compose.demo.yaml` |
| Compose VPS | `deploy/demo/compose.demo.vps.yaml` |
| Guia operador | `deploy/demo/OPERATOR.md` |
| robots.txt | `web/public/robots.txt` |
| standalone build | `web/.next/standalone/server.js` (validado) |

## Próximo passo seguro (operador)

1. Informar host VPS e confirmar Tunnel saudável.
2. Na VPS: `ss -ltnp | grep 3107` e `ls /srv/docker/perola-demo` — parar se ocupados.
3. `docker ps` antes/depois para prova de não interferência.
4. Seguir `deploy/demo/OPERATOR.md`.
5. Cadastrar hostname no Dashboard do Tunnel (sem editar configs de outros projetos).
6. Preferir Cloudflare Access (OTP) — e-mails fora do repositório.
