# Prototype 02 — Mapa de Rotas

| Rota | Superfície | Descrição |
|------|------------|-----------|
| `/` | — | Redirect → `/demo` |
| `/demo` | Cliente | Home Pérola Gastrobar |
| `/demo/eventos` | Cliente | Calendário + lista |
| `/demo/eventos/[slug]` | Cliente | Página do evento |
| `/demo/reservar/[slug]` | Cliente | Wizard de solicitação |
| `/demo/reserva/[code]` | Cliente | Acompanhamento (ex.: PROTO-007) |
| `/demo/admin` | Admin | Visão de hoje |
| `/demo/admin/reservas` | Admin | Fila + filtros |
| `/demo/admin/reservas/[id]` | Admin | Detalhe + ações (RES-007) |
| `/demo/admin/mapa` | Admin | SVG + lista + painel |
| `/demo/admin/preparacao` | Admin | Por reserva / consolidada |
| `/demo/admin/eventos` | Admin | Lista + calendário |
| `/demo/admin/eventos/novo` | Admin | Wizard criar/publicar |
| `/demo/admin/cardapio` | Admin | CRUD visual local |
| `/demo/admin/site` | Admin | Branding + preview |
| `/demo/admin/clientes` | Admin | Histórico leve |
| `/demo/admin/configuracoes` | Admin | Espaços + hipóteses |

Seletor global: **Cliente** ↔ **Painel da casa**.
