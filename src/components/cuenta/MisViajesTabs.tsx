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

export type PublicacionViajeItem = {
  kind: "publicacion";
  id: string;
  tipo: "ruta" | "bulto";
  titulo: string;
  fecha: string;
};

export type ViajeListItem =
  | ReservaViajeItem
  | OfertaViajeItem
  | PublicacionViajeItem;

const TABS: { id: ApartadoViajes; label: string }[] = [
  { id: "propuestos", label: "Propuestos" },
  { id: "aceptados", label: "Aceptados por mí como conductor" },
  { id: "pagados", label: "Pagados por mí" },
  { id: "para_mi", label: "Aceptaciones de conductores" },
  { id: "historial", label: "Historial" },
];

function ReservaCard({ item }: { item: ReservaViajeItem }) {
  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{item.titulo}</p>
          <p className="text-xs text-zinc-500">
            {item.esCliente ? "Como pasajero" : "Como conductor"} ·{" "}
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
              ? "Un conductor te ha puesto precio para este viaje."
              : "Tú has puesto precio a este viaje."}
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

function PublicacionCard({ item }: { item: PublicacionViajeItem }) {
  const href = item.tipo === "ruta" ? `/rutas/${item.id}` : `/bultos/${item.id}`;
  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{item.titulo}</p>
          <p className="text-xs text-zinc-500">
            {item.tipo === "ruta" ? "Como conductor" : "Como pasajero"} ·{" "}
            {new Date(item.fecha).toLocaleDateString("es-ES")}
          </p>
        </div>
        <Badge tone="green">Publicado</Badge>
      </div>
      <ButtonLink
        href={href}
        fullWidth
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
      >
        Ver anuncio
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
      {items.map((item) => {
        if (item.kind === "reserva") {
          return <ReservaCard key={`r-${item.id}`} item={item} />;
        }
        if (item.kind === "oferta") {
          return <OfertaCard key={`o-${item.id}`} item={item} />;
        }
        return <PublicacionCard key={`p-${item.tipo}-${item.id}`} item={item} />;
      })}
    </div>
  );
}

export function MisViajesTabs({
  propuestos,
  aceptados,
  pagados,
  paraMi,
  historial,
}: {
  propuestos: ViajeListItem[];
  aceptados: ViajeListItem[];
  pagados: ViajeListItem[];
  paraMi: ViajeListItem[];
  historial: ViajeListItem[];
}) {
  const [tab, setTab] = useState<ApartadoViajes>("propuestos");

  const counts = {
    propuestos: propuestos.length,
    aceptados: aceptados.length,
    pagados: pagados.length,
    para_mi: paraMi.length,
    historial: historial.length,
  };

  const listas: Record<ApartadoViajes, ViajeListItem[]> = {
    propuestos,
    aceptados,
    pagados,
    para_mi: paraMi,
    historial,
  };
  const vacios: Record<ApartadoViajes, string> = {
    propuestos: "Aún no has propuesto ningún viaje.",
    aceptados: "Aquí saldrán los viajes que hayas aceptado como conductor.",
    pagados: "Aquí saldrán los viajes que tú hayas pagado.",
    para_mi:
      "Aquí saldrán los viajes propuestos por ti y que algún conductor haya puesto precio.",
    historial: "Aún no hay viajes completados o cancelados.",
  };

  return (
    <div className="space-y-4">
      <div
        className={`flex flex-wrap gap-1 rounded-xl border p-1 ${CUENTA_TABS_LIST}`}
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
              "min-w-[46%] flex-1 rounded-lg px-1 py-2 text-center text-[10px] font-semibold leading-tight transition-colors sm:min-w-0 sm:px-2 sm:py-2.5 sm:text-sm",
              tab === t.id ? CUENTA_TAB_ACTIVE : CUENTA_TAB_INACTIVE,
            ].join(" ")}
          >
            {t.label}
            {counts[t.id] > 0 && (
              <span className="ml-0.5 text-zinc-500">({counts[t.id]})</span>
            )}
          </button>
        ))}
      </div>

      <ListaApartado items={listas[tab]} vacio={vacios[tab]} />
    </div>
  );
}
