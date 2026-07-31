# UX 10 — Cardápio, Combos e Gestão do Site

**Produto:** Gestor Camarote  
**Telas:** ADM-12, ADM-13, ADM-14  
**Princípio:** um cadastro → site, evento, reserva, preparação  

---

## 1. Cardápio e combos (ADM-12 / ADM-13)

### Lista

```
┌─ Cardápio ──────────────── [+ Novo item] ─┐
│ Busca · Categoria ▼ · Status ▼            │
│                                           │
│ Balde Heineken · Bebidas · R$ 99 · Ativo  │
│ ★ destaque · disponível em reserva        │
│ Pacote Neon · Aniversário · R$ 350        │
│ Porção Batata · … · Esgotado              │
└───────────────────────────────────────────┘
```

### Form item

```
Nome *
Descrição
Imagem [Upload]
Categoria *
Preço *
Status: ( ) Ativo  ( ) Inativo  ( ) Esgotado
☑ Disponível para reserva antecipada
☑ Destacar no site
Limite por evento (opcional)
Eventos: [associar] ou “todos os futuros”
[ Salvar ]
```

**Aviso UX ao mudar preço:**

> Novas solicitações usarão R$ 120. Reservas já enviadas mantêm o preço da época (snapshot).

Sem controle de estoque: “Esgotado” é flag manual.

---

## 2. Propagação de dados (diagrama mental)

```
CatalogItem (cadastro)
   ├── Site (destaques / cardápio público)
   ├── Página do evento (itens associados)
   ├── Wizard adicionais (preço vigente)
   └── ReservationItem (snapshot nome+preço)
           └── PreparationItem
```

Admin não edita snapshot no prep; edita ReservationItem com consciência (SHOULD confirmar se confirmada).

---

## 3. Site / branding (ADM-14)

Sem page builder.

```
┌─ Site público ────────────────────────────┐
│ Logo [Upload]                             │
│ Cor primária [#____]  Secundária [#____]  │
│ Imagem hero / banners                     │
│ Nome · Endereço · Telefone                │
│ Instagram · WhatsApp                      │
│ Horário de funcionamento                  │
│ ☑ Mostrar cardápio  ☑ Mostrar combos      │
│                                           │
│ [ Salvar ]  [ Ver site ↗ ]                │
│                                           │
│ Pré-visualização (iframe ou painel)       │
│ ┌─────────────────────────────────────┐   │
│ │ Home pública esquemática            │   │
│ └─────────────────────────────────────┘   │
└───────────────────────────────────────────┘
```

**Rascunho vs publicado (settings):** MVP pode salvar direto (efeito imediato no público). Se precisar de “rascunho de branding”, marcar como SHOULD — **hipótese**; default = save publica settings.

Eventos têm status próprio (rascunho/publicado) — não confundir.

---

## 4. Preview

- Botão “Ver site” abre superfície pública do venue em nova aba (tenant atual).  
- Preview inline esquemático suficiente no MVP; fidelidade pixel = protótipo visual.  

---

## 5. Permissões

- Gestor: total  
- Reservas: pode editar itens/preços (configurável; default sim no MVP para agilidade)  
- Recepção/Prep: sem acesso  

---

## 6. Estados e erros

| Caso | Mensagem |
|------|----------|
| Imagem grande demais | “Use imagem até X MB.” |
| Preço inválido | Inline |
| Item em uso inativado | Permitido; some de novos fluxos |

---

## 7. Rastreabilidade

- FR-CATALOG-*; FR-VENUE-003; FR-PUBLIC-SITE-001, 003  
- BR-CAT-*; DEC-SNAP-001; DEC-PUB-001; DEC-CAT-001  
- AC-CAT-001, 002  
