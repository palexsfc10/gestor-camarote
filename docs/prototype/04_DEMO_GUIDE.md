# Prototype 04 — Guia de Demonstração

**Duração:** 6–10 min  
**App:** `web/` · `pnpm dev` ou `npm exec pnpm@10 -- dev`

## Roteiro rápido (admin first)

1. Abrir `/demo` — mostrar home Pérola + Pagode do Piska.  
2. Alternar para **Painel da casa**.  
3. Visão de hoje — pendências, métricas sem gráficos.  
4. Abrir **Reservas → Mariana (RES-007)**.  
5. **Confirmar** — ler consequências no dialog.  
6. **Mapa** — C07 vira OK; legenda + lista no mobile.  
7. **Preparação** — toggle por reserva / consolidada; avançar status.  
8. Voltar ao **Cliente** → `/demo/reserva/PROTO-007` — status confirmada.  

## Roteiro cliente (nova solicitação)

1. `/demo/reservar/pagode-do-piska`  
2. Escolher camarote **02 ou 08** (07 já pré-reservado).  
3. Seguir wizard (dados pré-preenchidos Mariana para velocidade).  
4. Enviar → mensagem obrigatória de solicitação ≠ confirmação.  

## Mensagens-chave

- “Solicitação enviada. Sua reserva ainda depende da confirmação da casa.”  
- Observações internas nunca no link público.  
- Banner: demonstração · sem backend.  
