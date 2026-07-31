# Prototype 01 — Design System (protótipo)

## Identidade visual

| Token | Valor | Uso |
|-------|-------|-----|
| Fundo | `#14111A` | Noite suave, não preto puro |
| Surface | `#1C1824` / `#26212F` | Painéis |
| Texto | `#F5F0E8` | Pérola |
| Muted | `#8F8796` | Secundário |
| Accent | `#D4AF37` | Champagne / premium gastrobar |
| Sucesso | `#2F6B4F` | Confirmado |
| Alerta | âmbar | Pré / sinal |
| Fonte display | Fraunces | Marca / títulos |
| Fonte UI | Outfit | Operação legível |

Evita: ERP cinza, neon exagerado, purple-on-white, excesso de cards/gráficos.

## Componentes

Button, Input, Textarea, Label, Badge, ConfirmDialog (Radix Dialog), Status badges, VenueMap SVG, ModeSwitcher, Toast.

## Versões da stack

| Pacote | Versão |
|--------|--------|
| next | 16.2.12 |
| react / react-dom | 19.2.4 |
| typescript | ^5 |
| tailwindcss | ^4 |
| zod | ^4.4.3 |
| react-hook-form | ^7.83.0 |
| lucide-react | ^1.28.0 |
| @radix-ui/* | ver package.json |
| vitest | ^4.1.10 |
| @playwright/test | ^1.62.1 |
| pnpm (via npm exec) | 10.34.5 |

shadcn/ui: padrões manuais (CVA + Radix), sem CLI interativa.
