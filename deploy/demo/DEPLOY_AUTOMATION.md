# Deploy automation — Pérola demo (Gestor Camarote)

Automação idempotente para o operador publicar a demo frontend na VPS **sem**
intervenção do Cursor na máquina remota.

| Item | Valor |
| --- | --- |
| Repositório | https://github.com/palexsfc10/gestor-camarote |
| Hostname público (planejado) | `perola-demo.ntws.cloud` |
| Diretório VPS | `/srv/docker/perola-demo` |
| Bind local | `127.0.0.1:3107` → container `:3000` |
| Hostname VPS esperado | `srv1793294` |
| Compose | `deploy/demo/compose.demo.yaml` |
| Serviço | `perola-demo-web` apenas |

Esta automação **não** altera Cloudflare, firewall, SSH, DNS nem outros stacks
(Kyvora, Arena, Croniu, PostgreSQL, Cloudflared).

---

## Layout na VPS

```text
/srv/docker/perola-demo/
  .perola-demo-marker
  CURRENT_SHA
  PREVIOUS_SHA
  LAST_DEPLOY_REPORT.txt
  repo/                 # git clone (checkout detached no SHA)
  logs/                 # preflight/deploy/failure/smoke + lock
  releases/<sha>/
  backups/
```

O clone fica em `repo/`. O compose do monorepo (`context: ../../web`) resolve
para `repo/web` — **não** é necessário copiar `web/` para fora do clone.

---

## Scripts

| Script | Função |
| --- | --- |
| `preflight-vps.sh` | Inventário e validações pré-publicação |
| `deploy-vps.sh <sha>` | Deploy controlado com health + smoke + relatório |
| `smoke-vps.sh` | Smokes internos (`127.0.0.1:3107`); `--external` opcional |
| `status-vps.sh` | SHA, health, porta, memória, logs, HTTP |
| `rollback-vps.sh` | Rollback só da demo (`PREVIOUS_SHA`) |
| `lib/common.sh` | Funções compartilhadas (lock, logs, compose, git) |

Makefile na raiz apenas chama esses scripts (`make demo-*`).

Todos usam `set -Eeuo pipefail`, `flock`, timestamps, códigos de saída e
**não imprimem segredos** (não há credenciais nos scripts).

---

## Fluxo do deploy

1. Lock + preflight (hostname, root, Docker, disco, memória, porta 3107).
2. Snapshot de containers (`containers-before-*.txt`).
3. Clone ou `git fetch` (sem `pull`); remote deve ser `gestor-camarote`.
4. Valida o SHA no remoto; **checkout detached** exatamente nesse commit.
5. `docker compose config` + regras de isolamento (só `perola-demo-web`,
   bind `127.0.0.1:3107:3000`, rede `perola-demo-net`, sem DB/privileged/host
   network/socket Docker/redes externas).
6. `build` + `up -d` **somente** `perola-demo-web` (sem `compose down`, sem prune).
7. Aguarda health até ~120s; em falha coleta diagnóstico e rollback automático.
8. Smokes internos.
9. Grava `CURRENT_SHA`, relatório `logs/deploy-<ts>.log` e `LAST_DEPLOY_REPORT.txt`.
10. Confirma que stacks protegidos não reiniciaram.

SHA é **obrigatório**. Não se implanta `HEAD` de `main` implicitamente.

---

## Fluxo do rollback

**Manual** (`rollback-vps.sh`):

1. Confirmação explícita (ou `--yes`).
2. Diagnóstico + snapshot.
3. Se não houver `PREVIOUS_SHA`: para só `perola-demo-web` e encerra com
   `DEPLOY_FAILED_NO_PREVIOUS_RELEASE`.
4. Senão: checkout do SHA anterior → build → up → health → smoke.
5. Atualiza ponteiros SHA. Repo e logs são preservados.

**Automático** (falha no deploy): restaura o último `CURRENT_SHA` conhecido
(antes desta tentativa), não o `PREVIOUS_SHA` (evita saltar um release).

Nunca remove redes/volumes de outros projetos.

---

## Comandos do operador

Scripts funcionam com caminho absoluto; o cwd do operador é irrelevante.

### Primeiro preflight

```bash
sudo /srv/docker/perola-demo/repo/deploy/demo/preflight-vps.sh
# ou, a partir de um clone local do repo:
sudo ./deploy/demo/preflight-vps.sh
```

### Simulação

```bash
sudo ./deploy/demo/deploy-vps.sh \
  --dry-run \
  0528b4a5fca641c15468a6c506f8f153f3466da8
```

### Deploy real

```bash
sudo ./deploy/demo/deploy-vps.sh \
  0528b4a5fca641c15468a6c506f8f153f3466da8
```

Equivalente Make:

```bash
make demo-deploy SHA=0528b4a5fca641c15468a6c506f8f153f3466da8
```

### Status

```bash
sudo ./deploy/demo/status-vps.sh
```

### Smoke externo (após Tunnel)

```bash
sudo ./deploy/demo/smoke-vps.sh \
  --external https://perola-demo.ntws.cloud
```

### Rollback

```bash
sudo ./deploy/demo/rollback-vps.sh
```

---

## Cloudflare (manual, uma vez)

A automação **não** acessa o Dashboard. Configuração inicial sugerida:

| Campo | Valor |
| --- | --- |
| Subdomain | `perola-demo` |
| Domain | `ntws.cloud` |
| Type | HTTP |
| URL | `localhost:3107` |

Depois que o hostname existir, deploys seguintes **não** exigem mudança no
Tunnel. Preferir Cloudflare Access (OTP) — e-mails fora deste repositório.
Detalhes adicionais: `OPERATOR.md`.

---

## Segurança

Scripts **proibidos** de:

- conter IP, senha ou chave SSH;
- alterar SSH, firewall, DNS ou Cloudflare;
- modificar outros composes;
- executar `docker system/image/volume/network prune`;
- executar `docker compose down` no deploy normal;
- sobrescrever diretórios desconhecidos em `/srv/docker/perola-demo`.

Porta `3107` ocupada por processo que **não** seja `perola-demo-web` → aborta.

---

## Veredictos do relatório

| Código | Significado |
| --- | --- |
| `DEPLOY_SUCCESS` | Health + smokes OK |
| `DEPLOY_SUCCESS_WITH_WARNINGS` | Sucesso com avisos (reservado) |
| `DEPLOY_FAILED_ROLLED_BACK` | Falha; versão anterior restaurada |
| `DEPLOY_FAILED_NO_PREVIOUS_RELEASE` | Falha; sem release anterior (demo parada) |

---

## Limitações

- Demo sem backend/banco; estado só no navegador.
- Cursor/CI desta automação **não** executa o deploy na VPS.
- `--dry-run` fora do host `srv1793294` emite WARN de hostname e não muta
  `/srv/docker/perola-demo`. Por padrão também **não** chama o daemon Docker
  (evita hangs locais); na VPS use `PEROLA_DEMO_DRY_RUN_DOCKER=1` para incluir
  `docker compose config` no dry-run.
- Smoke externo depende do Tunnel já configurado pelo operador.
- Override de hostname (lab): `PEROLA_DEMO_EXPECTED_HOSTNAME=...`.

---

## Relação com artefatos legados

- `compose.demo.vps.yaml` — layout antigo (`web/` ao lado do compose). O fluxo
  automatizado usa o clone + `compose.demo.yaml` do monorepo.
- `OPERATOR.md` — procedimento manual / Access / smokes manuais.
- Esta página — caminho preferido com um comando.
