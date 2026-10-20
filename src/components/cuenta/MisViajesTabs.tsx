"use client";

import { useRef, useState } from "react";
import { cargarMasHistorial } from "@/actions/historial";
import { Paginacion } from "@/components/listados/Paginacion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CompletarPagoBoton } from "@/components/reservas/CompletarPagoBoton";
import { CUENTA_BTN_SECONDARY, CUENTA_TAB_ACTIVE, CUENTA_TAB_INACTIVE, CUENTA_TABS_LIST } from "@/components/cuenta/cuenta-ui";
import { ESTADO_RESERVA_LABELS, chatPermitido } from "@/lib/reservas/labels";
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
  queIncluye: string;
  fecha: string;
  /** «Tramo:» en verde + ciudades; y/o rebaja aceptada. */
  notaTramo?: string | null;
  notaRebajaHecha?: boolean;
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
  /** Momento de salida, con hora. El día de la tarjeta sigue siendo `fecha`. */
  salidaEn?: string | null;
  estado: "publicado" | "cancelado";
  badge?: string;
  lineas?: string[];
  /** Lo que aún se puede reservar (bulto / plazas). */
  quedaLibre?: string | null;
  precioBulto?: number | null;
  precioPlaza?: number | null;
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
            {item.queIncluye} ·{" "}
            {new Date(item.fecha).toLocaleDateString("es-ES")}
          </p>
          {item.notaTramo || item.notaRebajaHecha ? (
            <p className="mt-1 text-sm font-medium text-zinc-800">
              {item.notaTramo ? (
                <>
                  <span className="font-semibold text-emerald-700">Tramo:</span>{" "}
                  {item.notaTramo}
                </>
              ) : null}
              {item.notaTramo && item.notaRebajaHecha ? " · " : null}
              {item.notaRebajaHecha ? "Rebaja de precio aceptada" : null}
            </p>
          ) : null}
        </div>
        <Badge tone={item.estado === "pendiente_pago" ? "amber" : "green"}>
          {item.estado === "pendiente_aprobacion" && !item.esCliente
            ? "Me toca aceptar o rechazar"
            : ESTADO_RESERVA_LABELS[item.estado]}
        </Badge>
      </div>
      <p className="text-sm font-medium text-emerald-700">
        {formatEur(item.precioTotal)}
      </p>
      {item.estado === "pendiente_pago" && (
        <>
          <p className="text-sm text-amber-950">No se ha cobrado nada.</p>
          <CompletarPagoBoton reservaId={item.id} label="Pagar con tarjeta" />
        </>
      )}
      <ButtonLink
        href={`/reservas/${item.id}`}
        fullWidth
        variant="secondary"
        className={CUENTA_BTN_SECONDARY}
      >
        {item.estado === "liberado"
          ? "Valorar viaje"
          : chatPermitido(item.estado)
            ? "Ver viaje y chat"
            : "Ver viaje"}
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
        <Badge tone="amber">A falta de aprobación</Badge>
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

function horaEnTarjeta(salidaEn: string | null | undefined): string {
  if (!salidaEn || /^\d{4}-\d{2}-\d{2}$/.test(salidaEn.trim())) return "";
  const d = new Date(salidaEn);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PublicacionCard({ item }: { item: PublicacionViajeItem }) {
  const href = item.tipo === "ruta" ? `/rutas/${item.id}` : `/bultos/${item.id}`;
  const hora = horaEnTarjeta(item.salidaEn);
  const tienePrecios =
    (item.precioBulto != null && item.precioBulto > 0) ||
    (item.precioPlaza != null && item.precioPlaza > 0);
  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-900">{item.titulo}</p>
          <p className="text-xs text-zinc-500">
            {item.tipo === "ruta" ? "Como conductor" : "Como pasajero"} ·{" "}
            {new Date(item.fecha).toLocaleDateString("es-ES")}
            {hora ? ` · ${hora}` : ""}
          </p>
        </div>
        <Badge tone={item.estado === "cancelado" ? "zinc" : "green"}>
          {item.estado === "cancelado"
            ? "Cancelado"
            : item.badge ?? "Publicado"}
        </Badge>
      </div>
      {item.lineas && item.lineas.length > 0 && (
        <div className="space-y-0.5 text-sm font-medium text-emerald-800">
          {item.lineas.map((linea) => (
            <p key={linea}>{linea}</p>
          ))}
        </div>
      )}
      {item.quedaLibre ? (
        <p className="text-sm font-semibold text-zinc-800">{item.quedaLibre}</p>
      ) : null}
      {tienePrecios && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-emerald-700">
          {item.precioBulto != null && item.precioBulto > 0 && (
            <p>
              {item.precioPlaza != null && item.precioPlaza > 0 ? (
                <>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Bulto
                  </span>
                  {formatEur(item.precioBulto)}
                </>
              ) : (
                formatEur(item.precioBulto)
              )}
            </p>
          )}
          {item.precioPlaza != null && item.precioPlaza > 0 && (
            <p>
              {item.precioBulto != null && item.precioBulto > 0 ? (
                <>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Plaza
                  </span>
                  {formatEur(item.precioPlaza)}
                </>
              ) : (
                formatEur(item.precioPlaza)
              )}
            </p>
          )}
        </div>
      )}
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
  sinPagar = [],
  paraMi,
  historial,
  historialHayMas = false,
}: {
  propuestos: ViajeListItem[];
  aceptados: ViajeListItem[];
  pagados: ViajeListItem[];
  sinPagar?: ReservaViajeItem[];
  paraMi: ViajeListItem[];
  historial: ViajeListItem[];
  historialHayMas?: boolean;
}) {
  const [tab, setTab] = useState<ApartadoViajes>("propuestos");
  const [historialLista, setHistorialLista] = useState(historial);
  const [hayMas, setHayMas] = useState(historialHayMas);
  const [pagina, setPagina] = useState(0);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [errorMas, setErrorMas] = useState<string | null>(null);
  const pidiendoMas = useRef(false);

  async function irAPagina(destino: number) {
    if (destino < 0 || pidiendoMas.current) return;
    if (destino === 0) {
      setHistorialLista(historial);
      setHayMas(historialHayMas);
      setPagina(0);
      setErrorMas(null);
      return;
    }
    pidiendoMas.current = true;
    setCargandoMas(true);
    setErrorMas(null);
    try {
      const resultado = await cargarMasHistorial(destino);
      if (resultado.error) {
        setErrorMas(resultado.error);
        return;
      }
      setHistorialLista(resultado.items);
      setHayMas(resultado.hayMas);
      setPagina(destino);
    } finally {
      pidiendoMas.current = false;
      setCargandoMas(false);
    }
  }

  const counts = {
    propuestos: propuestos.length,
    aceptados: aceptados.length,
    pagados: pagados.length,
    para_mi: paraMi.length,
    historial: historialLista.length,
  };

  const listas: Record<ApartadoViajes, ViajeListItem[]> = {
    propuestos,
    aceptados,
    pagados,
    para_mi: paraMi,
    historial: historialLista,
  };
  const vacios: Record<ApartadoViajes, string> = {
    propuestos: "Aún no has propuesto ningún viaje.",
    aceptados: "Aquí saldrán los viajes que hayas aceptado como conductor.",
    pagados: "Aquí saldrán los viajes que tú hayas pagado.",
    para_mi:
      "Aquí saldrán los viajes propuestos por ti y que algún conductor haya puesto precio.",
    historial: "Aún no hay viajes realizados o cancelados.",
  };

  return (
    <div className="space-y-4">
      {sinPagar.length > 0 && (
        <div className="space-y-3">
          <p className="text-base font-semibold text-amber-950">
            Pendiente de pago
          </p>
          {sinPagar.map((item) => (
            <ReservaCard key={`sin-${item.id}`} item={item} />
          ))}
        </div>
      )}
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
              "min-w-[46%] flex-1 rounded-lg px-1.5 py-2.5 text-center text-sm font-semibold leading-snug transition-colors sm:min-w-0 sm:px-2 sm:py-2.5 sm:text-base",
              tab === t.id ? CUENTA_TAB_ACTIVE : CUENTA_TAB_INACTIVE,
            ].join(" ")}
          >
            {t.label}
            {counts[t.id] > 0 && (t.id !== "historial" || (!hayMas && pagina === 0)) && (
              <span className="ml-0.5 text-zinc-500">({counts[t.id]})</span>
            )}
          </button>
        ))}
      </div>

      <ListaApartado items={listas[tab]} vacio={vacios[tab]} />
      {tab === "historial" && (hayMas || pagina > 0) && (
        <div className="space-y-2">
          <Paginacion
            pagina={pagina + 1}
            totalPaginas={pagina + 1 + (hayMas ? 1 : 0)}
            deshabilitado={cargandoMas}
            onPagina={(n) => irAPagina(n - 1)}
          />
          {errorMas ? <p className="text-sm text-red-600">{errorMas}</p> : null}
        </div>
      )}
    </div>
  );
}
