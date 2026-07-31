export type SpaceStatus =
  | "disponivel"
  | "pre_reservado"
  | "confirmado"
  | "ocupado"
  | "bloqueado"
  | "manutencao";

export type ReservationStatus =
  | "solicitada"
  | "aguardando_sinal"
  | "confirmada"
  | "cliente_chegou"
  | "cancelada"
  | "recusada"
  | "no_show"
  | "lista_espera"
  | "expirada";

export type ExperienceType = "camarote" | "mesa" | "aniversario";

export type SpaceKind = "camarote" | "mesa";

export type PrepStatus =
  | "pendente"
  | "em_preparacao"
  | "pronto"
  | "entregue"
  | "cancelado";

export type EventStatus = "rascunho" | "revisao" | "publicado" | "cancelado";

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
  soldOut: boolean;
  highlight: boolean;
  allowInReservation: boolean;
  eventIds: string[];
}

export interface VenueSpace {
  id: string;
  code: string;
  name: string;
  kind: SpaceKind;
  capacity: number;
  status: SpaceStatus;
  reservationId?: string;
  price: number;
  map: { x: number; y: number; w: number; h: number };
  /** Bloqueio estrutural da casa (não depende do evento). */
  blocked?: boolean;
}

export interface ReservationItem {
  catalogItemId: string;
  nameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
}

export interface PreparationLine {
  id: string;
  reservationId: string;
  catalogItemId: string;
  nameSnapshot: string;
  quantity: number;
  status: PrepStatus;
  spaceCode: string;
  responsible: string;
  expectedArrival?: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  publicCode: string;
  eventId: string;
  spaceId?: string;
  type: ExperienceType;
  status: ReservationStatus;
  responsibleName: string;
  phone: string;
  email?: string;
  partySize: number;
  guestNames: string[];
  expectedArrival?: string;
  celebrationName?: string;
  publicNotes?: string;
  internalNotes?: string;
  items: ReservationItem[];
  awaitingSignal?: boolean;
  signalInstructions?: string;
  history: { at: string; text: string }[];
  createdAt: string;
}

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  attraction: string;
  rules: string;
  imageGradient: string;
  status: EventStatus;
  description: string;
  /** Arte pública do evento (path em /public). Opcional para rascunhos. */
  posterImage?: string;
  category?: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  hours: string;
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
}

export interface CustomerLite {
  id: string;
  name: string;
  phone: string;
  lastVisit: string;
  reservations: number;
}
