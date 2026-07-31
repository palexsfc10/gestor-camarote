# 09 — Modelo de Domínio (Conceitual)

**Produto:** Gestor Camarote  
**Fase:** 0 — Documentação  
**Importante:** modelo conceitual apenas — sem migrations, ORM ou schemas físicos.

---

## 1. Diagrama de relações (textual)

```
Organization
  └── Venue
        ├── VenueUser
        ├── VenueSpace ── SpaceType
        ├── PublicPageSettings
        ├── CatalogCategory ── CatalogItem
        └── Event
              ├── EventSpace (VenueSpace + regras/preço do evento)
              ├── Reservation
              │     ├── ReservationGuest
              │     ├── BirthdayReservation (1:1 opcional)
              │     ├── ReservationItem (→ CatalogItem snapshot)
              │     ├── ReservationStatusHistory
              │     ├── CheckIn
              │     └── PreparationItem
              └── (referências a CatalogItem permitidos)
AuditLog (escopo Venue/Organization)
Customer (identidade leve cross-eventos do venue — opcional/mínima)
```

---

## 2. Entidades

### Organization
| | |
|--|--|
| **Responsabilidade** | Conta comercial multi-venue (futuro); billing futuro |
| **Atributos** | id, name, status, createdAt |
| **Relações** | 1:N Venue |
| **Sensíveis** | dados contratuais futuros |

### Venue
| | |
|--|--|
| **Responsabilidade** | Estabelecimento operacional (tenant de operação) |
| **Atributos** | id, organizationId, name, slug, address, geo?, phone, whatsapp, instagram, timezone, hours, status |
| **Relações** | N:1 Organization; 1:N spaces, users, events, catalog |
| **Invariantes** | slug único global ou por org; timezone obrigatório |

### VenueUser
| | |
|--|--|
| **Responsabilidade** | Acesso humano ao painel |
| **Atributos** | id, venueId, email, name, role, status, passwordHash |
| **Papéis** | manager, reservations, reception, preparation |
| **Sensíveis** | credenciais |

### SpaceType
| | |
|--|--|
| **Responsabilidade** | Classificação (camarote, mesa, bistrô, VIP, …) |
| **Atributos** | id, venueId, code, name, defaultMin, defaultMax, defaultRules |

### VenueSpace
| | |
|--|--|
| **Responsabilidade** | Espaço físico concreto |
| **Atributos** | id, venueId, spaceTypeId, code, name, capacityMin, capacityMax, mapX, mapY, mapLabel, active |
| **Invariantes** | code único por venue |

### Event
| | |
|--|--|
| **Responsabilidade** | Ocorrência reservável / divulgável |
| **Atributos** | id, venueId, title, slug, startsAt, endsAt, attraction, imageUrl, rulesText, status (`draft`,`published`,`unpublished`,`cancelled`,`archived`), publicDescription |
| **Invariantes** | endsAt > startsAt |

### EventSpace
| | |
|--|--|
| **Responsabilidade** | Espaço disponível em um evento com condições comerciais |
| **Atributos** | id, eventId, venueSpaceId, available, price, minConsumption, deposit, capacityMin, capacityMax, arrivalLimitTime, includedItems, allowedCatalogPolicy, statusOperational |
| **Invariantes** | unicidade (eventId, venueSpaceId); no máximo uma reserva ocupante ativa |

### Customer
| | |
|--|--|
| **Responsabilidade** | Identidade leve do consumidor no venue (não CRM pesado) |
| **Atributos** | id, venueId, fullName, phone, whatsapp, email?, cpfHash/cpfEncrypted?, birthDate? |
| **Sensíveis** | CPF, telefone, e-mail, nascimento |
| **Anonimizável** | sim, após retenção |

### Reservation
| | |
|--|--|
| **Responsabilidade** | Agregado raiz da solicitação/reserva |
| **Atributos** | id, publicId, venueId, eventId, eventSpaceId?, customerId, type, origin (`public`\|`admin`), status, partySize, expectedArrival, celebrationType?, notesPublic?, notesInternal?, depositAmount?, depositStatus?, idempotencyKey, expiresAt, createdAt |
| **Invariantes** | BR-RES-*; status transitions doc 10; partySize nos limites |
| **Sensíveis** | via Customer + notes |

### ReservationGuest
| | |
|--|--|
| **Responsabilidade** | Pessoa na lista |
| **Atributos** | id, reservationId, name, phone?, companionCount?, rsvpStatus? |
| **Sensíveis** | telefone se houver |

### BirthdayReservation
| | |
|--|--|
| **Responsabilidade** | Extensão de aniversário |
| **Atributos** | id, reservationId, celebrantName, displayName, packageCatalogItemId, guestLimit, decorationNotes, cakeNotes, shareLinkToken |
| **Invariantes** | guestLimit ≥ partySize/lista conforme regra |

### CatalogCategory
| | |
|--|--|
| **Atributos** | id, venueId, name, sortOrder, active |

### CatalogItem
| | |
|--|--|
| **Responsabilidade** | Item vendável/preparável |
| **Atributos** | id, categoryId, venueId, name, description, imageUrl, price, availability, highlight, advanceBooking, status (`active`,`inactive`,`sold_out`), eventLimits |
| **Não inclui** | estoque SKU completo |

### ReservationItem
| | |
|--|--|
| **Responsabilidade** | Snapshot do item na reserva |
| **Atributos** | id, reservationId, catalogItemId, nameSnapshot, unitPriceSnapshot, quantity, notes |

### PreparationItem
| | |
|--|--|
| **Responsabilidade** | Unidade de trabalho da equipe de preparação |
| **Atributos** | id, reservationId, reservationItemId?, eventId, catalogItemId, quantity, spaceLabel, dueTime?, status, assigneeInternal?, notes |
| **Status** | pendente, em_preparacao, pronto, entregue, cancelado |

### ReservationStatusHistory
| | |
|--|--|
| **Responsabilidade** | Trilha de status |
| **Atributos** | id, reservationId, fromStatus, toStatus, actorType, actorId, note, at |

### CheckIn
| | |
|--|--|
| **Responsabilidade** | Registro de chegada |
| **Atributos** | id, reservationId, at, byUserId, method (`manual`), notes? |

### AuditLog
| | |
|--|--|
| **Responsabilidade** | Auditoria ampla |
| **Atributos** | id, organizationId, venueId, actorId, action, entityType, entityId, payloadMeta, ip?, at |
| **Invariantes** | append-only lógico; sem PII desnecessária no payload (preferir refs) |

### PublicPageSettings
| | |
|--|--|
| **Responsabilidade** | Branding leve da página pública |
| **Atributos** | venueId, logoUrl, primaryColor, secondaryColor, heroImageUrl, banners[], showMenu, showCombos, customTexts |

---

## 3. Agregados (proposta)

| Agregado raiz | Entidades internas |
|---------------|-------------------|
| **Venue** | VenueUser, VenueSpace, SpaceType, PublicPageSettings, Catalog* |
| **Event** | EventSpace (ou EventSpace como entidade referenciada com invariante no Event) |
| **Reservation** | Guests, Birthday, Items, StatusHistory, CheckIn, PreparationItems |

**Nota:** PreparationItem pode ser consultado cross-reservation no evento, mas mutações de status pertencem ao contexto da preparação com referência à Reservation.

---

## 4. Invariantes críticos

1. Isolamento por `venueId` em todas as entidades operacionais.  
2. Unicidade de ocupação ativa por `EventSpace`.  
3. `Reservation` pública nunca nasce `confirmada`.  
4. Snapshot de preço em `ReservationItem`.  
5. Tokens públicos não enumeráveis.  
6. CPF armazenado protegido (hash para unicidade + criptografia para exibição controlada — decisão de implementação futura).  

---

## 5. Dados sensíveis vs anonimizáveis

| Dado | Sensível | Anonimizável |
|------|----------|--------------|
| Nome | moderado | parcial (iniciais) |
| Telefone / WhatsApp | sim | sim |
| E-mail | sim | sim |
| CPF | sim | sim (hash irreversível ou purge) |
| Data nascimento | sim | sim |
| Observações | pode conter PII | sim |
| Audit de acesso CPF | meta | retenção própria |

---

## 6. Regras multi-tenant no modelo

- Chave de partição lógica: `venueId` (e `organizationId` para billing futuro).  
- IDs públicos (`slug`, `publicId`) não devem vazar existência cross-tenant via mensagens de erro diferenciadas.  
- Jobs de expiração filtrados por venue.

---

## 7. O que este modelo deliberadamente omite

- Ledger financeiro completo  
- Estoque / fornecedor  
- Comanda / PDV  
- Entidades de IA  
- Mensageria WhatsApp como entidade de domínio no MVP  

---

Referência de estados: [10_STATUS_AND_STATE_MACHINES.md](10_STATUS_AND_STATE_MACHINES.md).
