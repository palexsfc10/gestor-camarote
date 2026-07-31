import type { ReservationStatus, SpaceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function SpaceStatusBadge({ status }: { status: SpaceStatus }) {
  const map: Record<
    SpaceStatus,
    { label: string; tone: "neutral" | "success" | "warn" | "danger" | "info" | "accent" }
  > = {
    disponivel: { label: "Livre", tone: "neutral" },
    pre_reservado: { label: "Pré-reservado", tone: "warn" },
    confirmado: { label: "Confirmado", tone: "success" },
    ocupado: { label: "No local", tone: "info" },
    bloqueado: { label: "Bloqueado", tone: "danger" },
    manutencao: { label: "Manutenção", tone: "danger" },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function ReservationStatusBadge({
  status,
  awaitingSignal,
}: {
  status: ReservationStatus;
  awaitingSignal?: boolean;
}) {
  if (awaitingSignal || status === "aguardando_sinal") {
    return <Badge tone="warn">Aguardando sinal</Badge>;
  }
  const map: Record<
    ReservationStatus,
    { label: string; tone: "neutral" | "success" | "warn" | "danger" | "info" | "accent" }
  > = {
    solicitada: { label: "Solicitada", tone: "accent" },
    aguardando_sinal: { label: "Aguardando sinal", tone: "warn" },
    confirmada: { label: "Confirmada", tone: "success" },
    cliente_chegou: { label: "Chegou", tone: "info" },
    cancelada: { label: "Cancelada", tone: "neutral" },
    recusada: { label: "Recusada", tone: "danger" },
    no_show: { label: "No-show", tone: "danger" },
    lista_espera: { label: "Lista de espera", tone: "neutral" },
    expirada: { label: "Expirada", tone: "neutral" },
  };
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
