"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CUENTA_BTN_SECONDARY, CUENTA_TAB_ACTIVE, CUENTA_TAB_INACTIVE, CUENTA_TABS_LIST } from "@/components/cuenta/cuenta-ui";
import { ESTADO_RESERVA_LABELS } from "@/lib/reservas/labels";
import type { ApartadoViajes } from "@/lib/reservas/categorias";
import { formatEur } from "@/lib/pricing";
import type { EstadoReserva } from "@/types/database";

export type ReservaViajeItem = {
  kind: "reserva";
  id: string;
  titulo: string;
  precioTotal: number;
  estado: EstadoReserva;
  esCliente: boolean;
  fecha: string;
};

export type OfertaViajeItem = {
  kind: "oferta";
  id: string;
  bultoId: string;
  titulo: string;
  precioTotal: number;
  esRecibida: boolean;
  fecha: string;
};

export type ViajeListItem = ReservaViajeItem | OfertaViajeItem;

const TABS: { id: ApartadoViajes; label: string }[] = [
  { id: "propuestos", label: "Propuestos" },
  { id: "aceptados", label: "Aceptados" },
  { id: "historial", label: "Historial" },
];

function ReservaCard({ item }: { item: ReservaViajeItem }) {
  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{item.titulo}</p>
          <p className="text-xs text-zinc-500">
            {item.esCliente ? "Como cliente" : "Como conductor"} ·{" "}
            {new Date(item.fecha).toLocaleDateString("es-ES")}
          </p>
        </div>
        <Badge tone="green">{ESTADO_RESERVA_LABELS[item.estado]}</Badge>
      </div>
      <p className="text-sm font-medium text-emerald-700">
        {formatEur(item.precioTotal)}
      </p>
      <ButtonLink
        href={`/reservas/${item.id}`}
        fullWidth
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
      >
        {item.estado === "liberado" ? "Valorar viaje" : "Ver reserva"}
      </ButtonLink>
    </Card>
  );
}

function OfertaCard({ item }: { item: OfertaViajeItem }) {
  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{item.titulo}</p>
          <p className="text-sm text-zinc-600">
            {item.esRecibida
              ? `Propuesta recibida para el viaje: ${item.titulo}`
              : `Propuesta enviada para el viaje: ${item.titulo}`}
          </p>
        </div>
        <Badge tone="amber">Pendiente</Badge>
      </div>
      <p className="text-sm font-medium text-emerald-700">
        {formatEur(item.precioTotal)}
      </p>
      <ButtonLink
        href={`/bultos/${item.bultoId}`}
        fullWidth
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
      >
        VER PROPUESTA
      </ButtonLink>
    </Card>
  );
}

function ListaApartado({
  items,
  vacio,
}: {
  items: ViajeListItem[];
  vacio: string;
}) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="text-base text-zinc-600">{vacio}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) =>
        item.kind === "reserva" ? (
          <ReservaCard key={`r-${item.id}`} item={item} />
        ) : (
          <OfertaCard key={`o-${item.id}`} item={item} />
        )
      )}
    </div>
  );
}

export function MisViajesTabs({
  propuestos,
  aceptados,
  historial,
  tienePublicacionesActivas = false,
}: {
  propuestos: ViajeListItem[];
  aceptados: ViajeListItem[];
  historial: ViajeListItem[];
  tienePublicacionesActivas?: boolean;
}) {
  const [tab, setTab] = useState<ApartadoViajes>("propuestos");

  const counts = {
    propuestos: propuestos.length,
    aceptados: aceptados.length,
    historial: historial.length,
  };

  const listas = { propuestos, aceptados, historial };
  const vacios: Record<ApartadoViajes, string> = {
    propuestos: tienePublicacionesActivas
      ? "Aún no hay propuestas de precio para tus solicitudes. Cuando un conductor proponga, aparecerá aquí. Mientras tanto, revisa tu anuncio arriba, en Mis publicaciones."
      : "Aquí verás propuestas de precio y reservas pendientes de tu decisión o pago.",
    aceptados: "No tienes viajes activos en este momento.",
    historial: "Aún no hay viajes completados o cancelados.",
  };

  return (
    <div className="space-y-4">
      <div
        className={`flex gap-1 rounded-xl border p-1 ${CUENTA_TABS_LIST}`}
        role="tablist"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={[
              "flex-1 rounded-lg px-2 py-2.5 text-center text-xs font-semibold transition-colors sm:text-sm",
              tab === t.id ? CUENTA_TAB_ACTIVE : CUENTA_TAB_INACTIVE,
            ].join(" ")}
          >
            {t.label}
            {counts[t.id] > 0 && (
              <span className="ml-1 text-zinc-500">({counts[t.id]})</span>
            )}
          </button>
        ))}
      </div>

      <ListaApartado items={listas[tab]} vacio={vacios[tab]} />
    </div>
  );
}
