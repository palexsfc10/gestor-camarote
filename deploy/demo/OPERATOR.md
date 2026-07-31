# Pérola Demo — guia do operador (NTWS Labs)

> **Preferido:** automação com um comando — ver [`DEPLOY_AUTOMATION.md`](./DEPLOY_AUTOMATION.md)
> (`deploy-vps.sh <sha>`, Makefile `demo-*`). Este documento cobre o procedimento
> manual, Cloudflare Access e contexto operacional.

## Escopo

- Demo **frontend only** (Next.js standalone).
- Sem backend, sem banco, dados fictícios.
- Hostname: `perola-demo.ntws.cloud`
- Diretório VPS: `/srv/docker/perola-demo`
- Bind local: `127.0.0.1:3107` → container `:3000`
- URL: https://perola-demo.ntws.cloud/demo

## Pré-requisitos na VPS

1. Confirmar que a porta **3107** está livre em localhost.
2. Confirmar que `/srv/docker/perola-demo` não existe ou está vazio para esta demo.
3. Inventariar containers (`docker ps`) e **não** reiniciar serviços de outros projetos.
4. Cloudflare Tunnel existente **saudável** (Dashboard ou agente já em execução).

## Layout sugerido na VPS

```text
/srv/docker/perola-demo/
  compose.demo.yaml      # use a variante VPS (context ./web)
  web/                   # app completo (Dockerfile incluso)
```

Copiar:

1. Conteúdo de `web/` → `/srv/docker/perola-demo/web/`
2. `deploy/demo/compose.demo.vps.yaml` → `/srv/docker/perola-demo/compose.demo.yaml`

(No monorepo, `compose.demo.yaml` usa `context: ../../web`.)

## Build e start (somente este compose)

```bash
cd /srv/docker/perola-demo
docker compose -f compose.demo.yaml build
docker compose -f compose.demo.yaml up -d
docker compose -f compose.demo.yaml ps
curl -sI http://127.0.0.1:3107/demo
```

Healthcheck deve ficar `healthy`. Logs com rotação já configurados no compose.

## Cloudflare Tunnel (Dashboard)

**Não alterar** hostnames existentes (Kyvora, Arena, Croniu, etc.).

Adicionar **novo** Public Hostname:

| Campo | Valor |
| --- | --- |
| Subdomain | `perola-demo` |
| Domain | `ntws.cloud` |
| Type | HTTP |
| URL | `localhost:3107` |

Não publicar a porta 3107 no firewall / IP público.

Se o Tunnel for gerenciado por arquivo local de outro projeto, **não editar** esse
arquivo. Preferir o Dashboard para este hostname isolado.

## Proteção de acesso (preferida)

**Opção A — Cloudflare Access (recomendada)**

1. Zero Trust → Access → Applications → Add application (Self-hosted).
2. Application domain: `perola-demo.ntws.cloud`.
3. Policy: Allow — emails do proprietário e do cliente (OTP / PIN de uso único).
4. **Não** gravar e-mails reais neste repositório.

**Opção B — Temporária**

Subdomínio público + `noindex` (já aplicado via metadata, `X-Robots-Tag` e
`robots.txt`). Somente dados fictícios; banner de demonstração visível.

Não criar autenticação improvisada no frontend.

## Smokes internos

```bash
curl -sI http://127.0.0.1:3107/demo | head
curl -sI http://127.0.0.1:3107/robots.txt | head
# Esperar X-Robots-Tag: noindex, nofollow, noarchive, nosnippet
```

## Smokes externos

Após o Tunnel + DNS:

- https://perola-demo.ntws.cloud/demo
- Programação, evento, reserva Mesa/Camarote/Aniversário
- Painel `/demo/admin`
- Reiniciar demonstração
- Mobile ~390px
- Certificado HTTPS válido
- Confirmar que outros containers **não** foram alterados: `docker ps` antes/depois

## Rollback

1. Remover ou desativar o Public Hostname `perola-demo.ntws.cloud` no Tunnel / Access.
2. Somente neste diretório:

```bash
cd /srv/docker/perola-demo
docker compose -f compose.demo.yaml down
```

3. Preservar logs se necessário (`docker logs perola-demo-web`).
4. **Não** executar `down` em outros composes.

## Limitações

- Estado da demo é por sessão do navegador (sessionStorage).
- Sem backend / persistência real.
- Não indexável; não é produção comercial.
