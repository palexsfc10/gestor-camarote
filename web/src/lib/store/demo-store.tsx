"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applySpaceOccupancyForEvent,
  filterPreparationsByEvent,
  filterReservationsByEvent,
} from "@/lib/event-ops";
import {
  EVENT_ID,
  initialCatalog,
  initialCustomers,
  initialEvents,
  initialPreparations,
  initialReservations,
  initialSite,
  structuralSpaces,
} from "@/lib/mock/seed";
import type {
  CatalogItem,
  CustomerLite,
  EventRecord,
  ExperienceType,
  PrepStatus,
  PreparationLine,
  Reservation,
  ReservationStatus,
  SiteSettings,
  SpaceStatus,
  VenueSpace,
} from "@/lib/types";

const SESSION_KEY = "gestor-camarote-demo-v2";

type PersistedDemo = {
  site: SiteSettings;
  events: EventRecord[];
  catalog: CatalogItem[];
  reservations: Reservation[];
  preparations: PreparationLine[];
  activeEventId: string;
};

function readSession(): PersistedDemo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedDemo;
  } catch {
    return null;
  }
}

function writeSession(data: PersistedDemo) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}

function rebuildSpaces(
  reservations: Reservation[],
  eventId: string,
): VenueSpace[] {
  return applySpaceOccupancyForEvent(
    structuredClone(structuralSpaces),
    reservations,
    eventId,
  );
}

type DemoState = {
  site: SiteSettings;
  events: EventRecord[];
  spaces: VenueSpace[];
  catalog: CatalogItem[];
  reservations: Reservation[];
  preparations: PreparationLine[];
  customers: typeof initialCustomers;
  activeEventId: string;
  toast: string | null;
};

type SubmitReservationInput = {
  type: ExperienceType;
  spaceId: string;
  eventId: string;
  responsibleName: string;
  phone: string;
  email?: string;
  partySize: number;
  guestNames: string[];
  expectedArrival?: string;
  celebrationName?: string;
  publicNotes?: string;
  items: Reservation["items"];
};

type DemoContextValue = DemoState & {
  setToast: (msg: string | null) => void;
  setActiveEventId: (eventId: string) => void;
  activeReservations: Reservation[];
  activePreparations: PreparationLine[];
  updateSite: (patch: Partial<SiteSettings>) => void;
  updateCatalogItem: (id: string, patch: Partial<CatalogItem>) => void;
  addCatalogItem: (item: CatalogItem) => void;
  updateEvent: (id: string, patch: Partial<EventRecord>) => void;
  addEvent: (event: EventRecord) => void;
  confirmReservation: (id: string) => void;
  refuseReservation: (id: string) => void;
  setAwaitingSignal: (id: string, instructions: string) => void;
  cancelReservation: (id: string) => void;
  checkInReservation: (id: string) => void;
  markNoShow: (id: string) => void;
  proposeSpace: (id: string, spaceId: string) => void;
  updatePrepStatus: (id: string, status: PrepStatus) => void;
  submitPublicReservation: (input: SubmitReservationInput) => Reservation;
  resetDemo: () => void;
  getReservation: (id: string) => Reservation | undefined;
  getSpace: (id: string) => VenueSpace | undefined;
  spaceStatusLabel: (s: SpaceStatus) => string;
  reservationStatusLabel: (s: ReservationStatus) => string;
};

const DemoContext = createContext<DemoContextValue | null>(null);

const spaceLabels: Record<SpaceStatus, string> = {
  disponivel: "Livre",
  pre_reservado: "Pré",
  confirmado: "OK",
  ocupado: "Local",
  bloqueado: "Bloq",
  manutencao: "Manut",
};

const reservationLabels: Record<ReservationStatus, string> = {
  solicitada: "Solicitada",
  aguardando_sinal: "Aguardando sinal",
  confirmada: "Confirmada",
  cliente_chegou: "Chegou",
  cancelada: "Cancelada",
  recusada: "Recusada",
  no_show: "No-show",
  lista_espera: "Lista de espera",
  expirada: "Expirada",
};

function nowStamp() {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [site, setSite] = useState(initialSite);
  const [events, setEvents] = useState(initialEvents);
  const [activeEventId, setActiveEventIdState] = useState(EVENT_ID);
  const [spaces, setSpaces] = useState(() =>
    rebuildSpaces(initialReservations, EVENT_ID),
  );
  const [catalog, setCatalog] = useState(initialCatalog);
  const [reservations, setReservations] = useState(initialReservations);
  const [preparations, setPreparations] = useState(initialPreparations);
  const [customers] = useState<CustomerLite[]>(initialCustomers);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const saved = readSession();
    if (saved) {
      /* eslint-disable react-hooks/set-state-in-effect -- intentional one-shot session restore */
      setSite(saved.site);
      setEvents(saved.events);
      setCatalog(saved.catalog);
      setReservations(saved.reservations);
      setPreparations(saved.preparations);
      const eventId = saved.activeEventId || EVENT_ID;
      setActiveEventIdState(eventId);
      setSpaces(rebuildSpaces(saved.reservations, eventId));
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeSession({
      site,
      events,
      catalog,
      reservations,
      preparations,
      activeEventId,
    });
  }, [hydrated, site, events, catalog, reservations, preparations, activeEventId]);

  const setActiveEventId = useCallback(
    (eventId: string) => {
      setActiveEventIdState(eventId);
      setSpaces(rebuildSpaces(reservations, eventId));
    },
    [reservations],
  );

  const syncSpaces = useCallback(
    (nextReservations: Reservation[], eventId = activeEventId) => {
      setSpaces(rebuildSpaces(nextReservations, eventId));
    },
    [activeEventId],
  );

  const releaseSpace = useCallback((spaceId: string | undefined) => {
    if (!spaceId) return;
    setSpaces((prev) =>
      prev.map((s) =>
        s.id === spaceId && !s.blocked
          ? { ...s, status: "disponivel", reservationId: undefined }
          : s,
      ),
    );
  }, []);

  const occupySpace = useCallback(
    (spaceId: string, reservationId: string, status: SpaceStatus) => {
      setSpaces((prev) =>
        prev.map((s) =>
          s.id === spaceId ? { ...s, status, reservationId } : s,
        ),
      );
    },
    [],
  );

  const confirmReservation = useCallback(
    (id: string) => {
      const res = reservations.find((r) => r.id === id);
      if (!res?.spaceId) return;
      const nextReservations = reservations.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "confirmada" as const,
              awaitingSignal: false,
              history: [
                ...r.history,
                { at: nowStamp(), text: "Confirmada pela casa (simulado)" },
              ],
            }
          : r,
      );
      setReservations(nextReservations);
      if (res.eventId === activeEventId) {
        occupySpace(res.spaceId, id, "confirmado");
      }
      setPreparations((prev) => {
        const without = prev.filter((p) => p.reservationId !== id);
        const space =
          structuralSpaces.find((s) => s.id === res.spaceId) ??
          spaces.find((s) => s.id === res.spaceId);
        const lines = res.items.map((item, idx) => ({
          id: `prep-${id}-${idx}`,
          reservationId: id,
          catalogItemId: item.catalogItemId,
          nameSnapshot: item.nameSnapshot,
          quantity: item.quantity,
          status: "pendente" as PrepStatus,
          spaceCode: space?.code ?? "?",
          responsible: res.responsibleName,
          expectedArrival: res.expectedArrival,
          notes: res.celebrationName
            ? `Nome no painel: ${res.celebrationName}`
            : undefined,
        }));
        return [...without, ...lines];
      });
      setToast("Reserva confirmada. Itens enviados para Preparação.");
    },
    [activeEventId, occupySpace, reservations, spaces],
  );

  const refuseReservation = useCallback(
    (id: string) => {
      const res = reservations.find((r) => r.id === id);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "recusada",
                history: [
                  ...r.history,
                  { at: nowStamp(), text: "Recusada pela casa" },
                ],
              }
            : r,
        ),
      );
      if (res?.eventId === activeEventId) releaseSpace(res?.spaceId);
      setToast("Solicitação recusada. Espaço liberado.");
    },
    [activeEventId, releaseSpace, reservations],
  );

  const setAwaitingSignal = useCallback((id: string, instructions: string) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "aguardando_sinal",
              awaitingSignal: true,
              signalInstructions: instructions,
              history: [
                ...r.history,
                { at: nowStamp(), text: "Aguardando sinal" },
              ],
            }
          : r,
      ),
    );
    setToast("Status atualizado: aguardando sinal.");
  }, []);

  const cancelReservation = useCallback(
    (id: string) => {
      const res = reservations.find((r) => r.id === id);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "cancelada",
                history: [
                  ...r.history,
                  { at: nowStamp(), text: "Cancelada pela casa" },
                ],
              }
            : r,
        ),
      );
      if (res?.eventId === activeEventId) releaseSpace(res?.spaceId);
      setPreparations((prev) =>
        prev.map((p) =>
          p.reservationId === id &&
          p.status !== "entregue" &&
          p.status !== "cancelado"
            ? { ...p, status: "cancelado" }
            : p,
        ),
      );
      setToast(
        "Reserva cancelada. Espaço liberado e preparação pendente cancelada.",
      );
    },
    [activeEventId, releaseSpace, reservations],
  );

  const checkInReservation = useCallback(
    (id: string) => {
      const res = reservations.find((r) => r.id === id);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "cliente_chegou",
                history: [
                  ...r.history,
                  { at: nowStamp(), text: "Chegada registrada" },
                ],
              }
            : r,
        ),
      );
      if (res?.spaceId && res.eventId === activeEventId) {
        occupySpace(res.spaceId, id, "ocupado");
      }
      setToast("Chegada registrada.");
    },
    [activeEventId, occupySpace, reservations],
  );

  const markNoShow = useCallback(
    (id: string) => {
      const res = reservations.find((r) => r.id === id);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "no_show",
                history: [...r.history, { at: nowStamp(), text: "No-show" }],
              }
            : r,
        ),
      );
      if (res?.eventId === activeEventId) releaseSpace(res?.spaceId);
      setPreparations((prev) =>
        prev.map((p) =>
          p.reservationId === id && p.status !== "entregue"
            ? { ...p, status: "cancelado" }
            : p,
        ),
      );
      setToast("No-show registrado. Espaço disponível novamente.");
    },
    [activeEventId, releaseSpace, reservations],
  );

  const proposeSpace = useCallback(
    (id: string, spaceId: string) => {
      const res = reservations.find((r) => r.id === id);
      const target = spaces.find((s) => s.id === spaceId);
      if (!res || !target || target.status !== "disponivel") {
        setToast("Espaço de destino indisponível.");
        return;
      }
      releaseSpace(res.spaceId);
      const nextStatus: SpaceStatus =
        res.status === "confirmada" || res.status === "cliente_chegou"
          ? res.status === "cliente_chegou"
            ? "ocupado"
            : "confirmado"
          : "pre_reservado";
      occupySpace(spaceId, id, nextStatus);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                spaceId,
                history: [
                  ...r.history,
                  {
                    at: nowStamp(),
                    text: `Espaço alterado para ${target.name}`,
                  },
                ],
              }
            : r,
        ),
      );
      setToast(`Reserva movida para ${target.name}.`);
    },
    [occupySpace, releaseSpace, reservations, spaces],
  );

  const updatePrepStatus = useCallback((id: string, status: PrepStatus) => {
    setPreparations((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p)),
    );
  }, []);

  const submitPublicReservation = useCallback(
    (input: SubmitReservationInput) => {
      const space = spaces.find((s) => s.id === input.spaceId);
      const eventMatches =
        input.eventId === activeEventId
          ? space
          : structuralSpaces.find((s) => s.id === input.spaceId);
      const available =
        input.eventId === activeEventId
          ? space && space.status === "disponivel"
          : (() => {
              const occ = rebuildSpaces(reservations, input.eventId).find(
                (s) => s.id === input.spaceId,
              );
              return occ?.status === "disponivel";
            })();
      if (!eventMatches || !available) {
        throw new Error("Espaço indisponível");
      }
      const isDemoCamarote07 = input.spaceId === "sp-07";
      if (isDemoCamarote07 && reservations.some((r) => r.id === "RES-007")) {
        throw new Error("Espaço indisponível");
      }
      const id = isDemoCamarote07
        ? "RES-007"
        : `RES-${Math.floor(Math.random() * 900 + 100)}`;
      const publicCode = isDemoCamarote07
        ? "PROTO-007"
        : `PROTO-${Math.floor(Math.random() * 900 + 100)}`;
      const reservation: Reservation = {
        id,
        publicCode,
        eventId: input.eventId,
        spaceId: input.spaceId,
        type: input.type,
        status: "solicitada",
        responsibleName: input.responsibleName,
        phone: input.phone,
        email: input.email,
        partySize: input.partySize,
        guestNames: input.guestNames,
        expectedArrival: input.expectedArrival,
        celebrationName: input.celebrationName,
        publicNotes: input.publicNotes,
        internalNotes: isDemoCamarote07
          ? "Priorizar confirmação — veio do Instagram"
          : undefined,
        items: input.items,
        history: [
          {
            at: nowStamp(),
            text: "Solicitação enviada — aguardando análise da casa",
          },
        ],
        createdAt: new Date().toISOString(),
      };
      const next = [reservation, ...reservations];
      setReservations(next);
      if (input.eventId === activeEventId) {
        occupySpace(input.spaceId, id, "pre_reservado");
      } else {
        syncSpaces(next, activeEventId);
      }
      setToast("Solicitação enviada. Aguardando análise da casa.");
      return reservation;
    },
    [activeEventId, occupySpace, reservations, spaces, syncSpaces],
  );

  const resetDemo = useCallback(() => {
    clearSession();
    setSite(structuredClone(initialSite));
    setEvents(structuredClone(initialEvents));
    setActiveEventIdState(EVENT_ID);
    setSpaces(rebuildSpaces(initialReservations, EVENT_ID));
    setCatalog(structuredClone(initialCatalog));
    setReservations(structuredClone(initialReservations));
    setPreparations(structuredClone(initialPreparations));
    setToast("Demonstração reiniciada.");
  }, []);

  const activeReservations = useMemo(
    () => filterReservationsByEvent(reservations, activeEventId),
    [reservations, activeEventId],
  );

  const activePreparations = useMemo(
    () =>
      filterPreparationsByEvent(preparations, reservations, activeEventId),
    [preparations, reservations, activeEventId],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      site,
      events,
      spaces,
      catalog,
      reservations,
      preparations,
      customers,
      activeEventId,
      toast,
      setToast,
      setActiveEventId,
      activeReservations,
      activePreparations,
      updateSite: (patch) => setSite((s) => ({ ...s, ...patch })),
      updateCatalogItem: (id, patch) =>
        setCatalog((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        ),
      addCatalogItem: (item) => setCatalog((prev) => [...prev, item]),
      updateEvent: (id, patch) =>
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        ),
      addEvent: (event) => setEvents((prev) => [...prev, event]),
      confirmReservation,
      refuseReservation,
      setAwaitingSignal,
      cancelReservation,
      checkInReservation,
      markNoShow,
      proposeSpace,
      updatePrepStatus,
      submitPublicReservation,
      resetDemo,
      getReservation: (id) => reservations.find((r) => r.id === id),
      getSpace: (id) => spaces.find((s) => s.id === id),
      spaceStatusLabel: (s) => spaceLabels[s],
      reservationStatusLabel: (s) => reservationLabels[s],
    }),
    [
      site,
      events,
      spaces,
      catalog,
      reservations,
      preparations,
      customers,
      activeEventId,
      toast,
      setActiveEventId,
      activeReservations,
      activePreparations,
      confirmReservation,
      refuseReservation,
      setAwaitingSignal,
      cancelReservation,
      checkInReservation,
      markNoShow,
      proposeSpace,
      updatePrepStatus,
      submitPublicReservation,
      resetDemo,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
