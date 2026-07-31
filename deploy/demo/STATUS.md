# Status do deploy Pérola Demo

Data: 2026-07-31

## Decisão atual

**Automação de VPS pronta no repositório.** Deploy remoto **não** executado por
esta etapa (Cursor sem acesso à VPS).

Ver: [`DEPLOY_AUTOMATION.md`](./DEPLOY_AUTOMATION.md)

## Artefatos

| Item | Caminho |
| --- | --- |
| Deploy automatizado | `deploy/demo/deploy-vps.sh` |
| Preflight / smoke / status / rollback | `deploy/demo/*-vps.sh` |
| Lib compartilhada | `deploy/demo/lib/common.sh` |
| Makefile | `Makefile` (`make demo-*`) |
| Compose monorepo (usado pela automação) | `deploy/demo/compose.demo.yaml` |
| Compose layout legado | `deploy/demo/compose.demo.vps.yaml` |
| Dockerfile | `web/Dockerfile` |

## Próximo passo (operador na VPS)

```bash
sudo ./deploy/demo/preflight-vps.sh
sudo ./deploy/demo/deploy-vps.sh --dry-run <sha>
sudo ./deploy/demo/deploy-vps.sh <sha>
```

Cloudflare Tunnel Public Hostname (`perola-demo` → `localhost:3107`) continua
**manual e único** — a automação não altera o Dashboard.
