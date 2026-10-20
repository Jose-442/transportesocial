"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AceptarRechazarBotones } from "@/components/reservas/AceptarRechazarBotones";
import { guardarRebajaReserva, rechazarRebajaTramo } from "@/actions/rebaja";

async function rechazarReservaEntera(reservaId: string): Promise<string | null> {
  try {
    const res = await fetch("/api/reservas/decidir", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(45000),
      body: JSON.stringify({ reservaId, decision: "rechazar" }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok || json.error) {
      return json.error || "No se ha podido guardar. Prueba otra vez.";
    }
    window.location.reload();
    return null;
  } catch {
    return "No se ha podido guardar. Prueba otra vez.";
  }
}
import { usePrecioMinimoCarretera } from "@/components/rutas/usePrecioMinimoCarretera";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import { mensajePrecioPorDebajo, precioVisiblePorDebajo } from "@/lib/precio-minimo";
import {
  agruparPortesRebajaTramo,
  TEXTO_CANCELAR_TRAMO_SIN_REBAJA,
  TEXTO_PLAZA_TRAMO_ANADIR_CONDUCTOR,
  TEXTO_REBAJA_TRAMO_CONDUCTOR,
} from "@/lib/reservas/rebaja";

export type PorteRebaja = {
  id: string;
  precioTotal: number;
  pideRebaja: boolean;
  rebajaEn: string | null;
  rebajaEur: number | null;
  estado: string;
  salida: string;
  descripcion: string | null;
  esTramo?: boolean;
  rebajaRechazadaEn?: string | null;
};

function TextoEstado({
  porte,
  esConductor,
  rutaId,
  cuantasPlazas,
}: {
  porte: PorteRebaja;
  esConductor: boolean;
  rutaId: string | null;
  cuantasPlazas: number;
}) {
  if (porte.rebajaEn) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-zinc-700">
          El conductor ha guardado un precio más bajo.
          {porte.rebajaEur != null && porte.rebajaEur > 0
            ? ` Se ha devuelto ${formatEur(porte.rebajaEur)}.`
            : " Se ha devuelto la diferencia."}
        </p>
        {esConductor && rutaId ? (
          <p className="text-base text-zinc-700">
            Si quieres volver a publicar el hueco que queda, hazlo en el viaje
            pulsando{" "}
            <Link
              href={`/rutas/${rutaId}`}
              className="font-semibold text-emerald-700 underline"
            >
              AQUÍ
            </Link>
            .
          </p>
        ) : null}
      </div>
    );
  }

  if (porte.rebajaRechazadaEn) {
    return (
      <p className="text-sm text-zinc-700">
        {esConductor
          ? "Has indicado que no aceptas la rebaja."
          : `El conductor no ha aceptado la rebaja. La reserva sigue. ${TEXTO_CANCELAR_TRAMO_SIN_REBAJA}`}
      </p>
    );
  }

  if (!esConductor) {
    return (
      <p className="text-sm text-zinc-700">
        Has pedido una rebaja
        {cuantasPlazas > 1 ? ` para ${cuantasPlazas} plazas de este viaje` : ""}.
        El precio no cambia hasta que el conductor guarde el precio nuevo o diga
        que no la acepta.
      </p>
    );
  }

  return null;
}

function NotaPlazaTramo({ rutaId }: { rutaId: string | null }) {
  return (
    <p className="text-sm font-medium text-emerald-950">
      Aunque 1 pasajero solo use un tramo, la web cuenta esa plaza como ocupada
      en todo el viaje. Si se baja en una parada y otra persona quiere subir,
      añade otra plaza
      {rutaId ? (
        <>
          {" "}
          (
          <Link
            href={`/rutas/${rutaId}`}
            className="font-semibold text-emerald-700 underline"
          >
            Añadir más capacidad
          </Link>
          )
        </>
      ) : (
        " («Añadir más capacidad»)"
      )}
      .
    </p>
  );
}

function Formulario({
  porte,
  origen,
  destino,
  rutaId,
  cuantasPlazas,
  precioPagadoTotal,
  etiquetaBoton,
  onVolver,
  mostrarNotaTramo,
}: {
  porte: PorteRebaja;
  origen: string;
  destino: string;
  rutaId: string | null;
  cuantasPlazas: number;
  precioPagadoTotal: number;
  etiquetaBoton: string;
  onVolver?: () => void;
  mostrarNotaTramo?: boolean;
}) {
  const router = useRouter();
  const minimo = usePrecioMinimoCarretera(origen, destino);
  const [netoTexto, setNetoTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const enviando = useRef(false);
  const neto = Number(netoTexto.replace(",", "."));
  const visible = Number.isFinite(neto) && neto > 0 ? calcPrecioConComision(neto) : 0;
  const diferencia = precioPagadoTotal - visible;
  const bajoMinimo =
    minimo.precioMinimo != null &&
    visible > 0 &&
    precioVisiblePorDebajo(visible, minimo.precioMinimo);
  const noBaja = visible > 0 && diferencia < 0.01;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando.current) return;
    enviando.current = true;
    setError(null);
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("reserva_id", porte.id);
    let result: Awaited<ReturnType<typeof guardarRebajaReserva>>;
    try {
      result = await guardarRebajaReserva(formData);
    } finally {
      enviando.current = false;
      setLoading(false);
    }
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input
        name="precio_neto"
        label="Precio nuevo (neto, sin gastos)"
        type="text"
        inputMode="decimal"
        value={netoTexto}
        onChange={(e) => setNetoTexto(e.target.value)}
        placeholder="Ej. 40"
        required
      />
      {visible > 0 ? (
        <p className="text-sm text-zinc-700">
          Quien reservó verá {formatEur(visible)}.
          {diferencia >= 0.01
            ? ` Se le devolverán ${formatEur(diferencia)}.`
            : ""}
        </p>
      ) : null}
      {bajoMinimo && minimo.precioMinimo != null ? (
        <p className="text-sm text-red-600">
          {mensajePrecioPorDebajo(minimo.precioMinimo)}
        </p>
      ) : null}
      {noBaja ? (
        <p className="text-sm text-red-600">
          El precio nuevo tiene que ser más bajo.
        </p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        type="submit"
        fullWidth
        disabled={
          loading ||
          minimo.cargando ||
          Boolean(minimo.error) ||
          bajoMinimo ||
          noBaja ||
          visible <= 0
        }
      >
        {loading ? "Guardando…" : etiquetaBoton}
      </Button>
      {mostrarNotaTramo ? <NotaPlazaTramo rutaId={rutaId} /> : null}
      {onVolver ? (
        <Button
          type="button"
          variant="ghost"
          fullWidth
          disabled={loading}
          onClick={onVolver}
        >
          Volver
        </Button>
      ) : null}
      {rutaId ? (
        <p className="text-base text-zinc-700">
          Si lo guardas y quieres publicar el hueco que queda, hazlo en el viaje
          pulsando{" "}
          <Link
            href={`/rutas/${rutaId}`}
            className="font-semibold text-emerald-700 underline"
          >
            AQUÍ
          </Link>
          .
        </p>
      ) : null}
    </form>
  );
}

function TarjetaConductorRebaja({
  porte,
  porteVista,
  cuantasPlazas,
  precioPagadoTotal,
  origen,
  destino,
  rutaId,
  grupo,
}: {
  porte: PorteRebaja;
  porteVista: PorteRebaja;
  cuantasPlazas: number;
  precioPagadoTotal: number;
  origen: string;
  destino: string;
  rutaId: string | null;
  grupo: PorteRebaja[];
}) {
  const router = useRouter();
  const pendienteDecision =
    !porteVista.rebajaEn && !porteVista.rebajaRechazadaEn;
  const reservaPendiente = porteVista.estado === "pendiente_aprobacion";
  const [paso, setPaso] = useState<"elegir" | "precio" | "reserva">("elegir");
  const [guardandoNo, setGuardandoNo] = useState(false);
  const [errorNo, setErrorNo] = useState<string | null>(null);
  const enviandoNo = useRef(false);

  const titulo = porteVista.rebajaEn
    ? "Rebaja aplicada"
    : porteVista.rebajaRechazadaEn
      ? "Rebaja no aceptada"
      : cuantasPlazas > 1
        ? `Hay una solicitud de rebaja (${cuantasPlazas} plazas)`
        : "Hay una solicitud de rebaja";

  async function noAceptoRebaja() {
    if (reservaPendiente) {
      setPaso("reserva");
      return;
    }
    if (enviandoNo.current) return;
    enviandoNo.current = true;
    setGuardandoNo(true);
    setErrorNo(null);
    const fd = new FormData();
    fd.set("reserva_id", porte.id);
    const result = await rechazarRebajaTramo(fd);
    enviandoNo.current = false;
    setGuardandoNo(false);
    if (result.error) {
      setErrorNo(result.error);
      return;
    }
    router.refresh();
  }

  async function aceptarReservaPrecioPagado() {
    if (enviandoNo.current) return;
    enviandoNo.current = true;
    setGuardandoNo(true);
    setErrorNo(null);
    const fd = new FormData();
    fd.set("reserva_id", porte.id);
    fd.set("aceptar_reserva", "1");
    const result = await rechazarRebajaTramo(fd);
    enviandoNo.current = false;
    setGuardandoNo(false);
    if (result.error) {
      setErrorNo(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <Card className="space-y-2 border-emerald-200 bg-emerald-50/40">
      <p className="text-base font-semibold text-emerald-950">{titulo}</p>

      {pendienteDecision && (porteVista.esTramo || grupo.some((p) => p.esTramo)) ? (
        <p className="text-sm font-medium text-emerald-950">
          {TEXTO_REBAJA_TRAMO_CONDUCTOR}
        </p>
      ) : null}

      {cuantasPlazas > 1 && pendienteDecision ? (
        <ul className="list-inside list-disc text-sm text-zinc-700">
          {grupo.map((p) => (
            <li key={p.id}>
              {p.descripcion?.trim() || "Plaza"} · {formatEur(p.precioTotal)}
            </li>
          ))}
        </ul>
      ) : null}

      {!pendienteDecision ? (
        <TextoEstado
          porte={porteVista}
          esConductor
          rutaId={rutaId}
          cuantasPlazas={cuantasPlazas}
        />
      ) : null}

      {pendienteDecision && paso === "elegir" ? (
        <div className="space-y-2">
          <Button type="button" fullWidth onClick={() => setPaso("precio")}>
            Acepto la rebaja
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={guardandoNo}
            onClick={() => void noAceptoRebaja()}
          >
            {guardandoNo ? "Guardando…" : "No acepto la rebaja"}
          </Button>
          {errorNo ? <p className="text-sm text-red-700">{errorNo}</p> : null}
        </div>
      ) : null}

      {pendienteDecision && paso === "precio" ? (
        <Formulario
          porte={porte}
          origen={origen}
          destino={destino}
          rutaId={rutaId}
          cuantasPlazas={cuantasPlazas}
          precioPagadoTotal={precioPagadoTotal}
          etiquetaBoton="Guardar precio nuevo"
          onVolver={() => setPaso("elegir")}
          mostrarNotaTramo={
            Boolean(porteVista.esTramo || grupo.some((p) => p.esTramo))
          }
        />
      ) : null}

      {pendienteDecision && paso === "reserva" ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-700">
            No aceptas la rebaja. Ahora decide si aceptas la reserva por el
            precio pagado o la rechazas.
          </p>
          <Button
            type="button"
            fullWidth
            disabled={guardandoNo}
            onClick={() => void aceptarReservaPrecioPagado()}
          >
            {guardandoNo ? "Guardando…" : "Aceptar reserva (precio pagado)"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={guardandoNo}
            onClick={() => {
              void (async () => {
                setGuardandoNo(true);
                setErrorNo(null);
                const err = await rechazarReservaEntera(porte.id);
                if (err) {
                  setErrorNo(err);
                  setGuardandoNo(false);
                }
              })();
            }}
          >
            {guardandoNo ? "Guardando…" : "Rechazar reserva"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            disabled={guardandoNo}
            onClick={() => setPaso("elegir")}
          >
            Volver
          </Button>
          {errorNo ? <p className="text-sm text-red-700">{errorNo}</p> : null}
        </div>
      ) : null}

      {porteVista.rebajaRechazadaEn &&
      porteVista.estado === "pendiente_aprobacion" ? (
        <div className="space-y-2">
          <p className="text-sm text-zinc-700">
            Decide si aceptas la reserva por el precio pagado o la rechazas.
          </p>
          <AceptarRechazarBotones reservaId={porte.id} />
        </div>
      ) : null}
    </Card>
  );
}

export function RebajaReservas({
  portes,
  esConductor,
  origen,
  destino,
  rutaId,
}: {
  portes: PorteRebaja[];
  esConductor: boolean;
  origen: string;
  destino: string;
  rutaId: string | null;
}) {
  const grupos = agruparPortesRebajaTramo(portes);
  if (grupos.length === 0) return null;

  return (
    <div className="space-y-2">
      {grupos.map((grupo) => {
        const porte = grupo[0];
        const cuantasPlazas = grupo.length;
        const precioPagadoTotal = grupo.reduce(
          (sum, p) => sum + p.precioTotal,
          0
        );
        const rebajaEurSuma = grupo.reduce(
          (sum, p) => sum + (p.rebajaEur == null ? 0 : p.rebajaEur),
          0
        );
        const porteVista: PorteRebaja = {
          ...porte,
          precioTotal: precioPagadoTotal,
          rebajaEur:
            porte.rebajaEn || grupo.some((p) => p.rebajaEur != null)
              ? rebajaEurSuma
              : porte.rebajaEur,
          estado: grupo.every((p) => p.estado === "confirmada")
            ? "confirmada"
            : grupo.some((p) => p.estado === "pendiente_aprobacion")
              ? "pendiente_aprobacion"
              : porte.estado,
        };

        if (esConductor) {
          return (
            <TarjetaConductorRebaja
              key={grupo.map((p) => p.id).join("-")}
              porte={porte}
              porteVista={porteVista}
              cuantasPlazas={cuantasPlazas}
              precioPagadoTotal={precioPagadoTotal}
              origen={origen}
              destino={destino}
              rutaId={rutaId}
              grupo={grupo}
            />
          );
        }

        const titulo = porteVista.rebajaEn
          ? "Rebaja aplicada"
          : porteVista.rebajaRechazadaEn
            ? "Rebaja no aceptada"
            : cuantasPlazas > 1
              ? `Hay una solicitud de rebaja (${cuantasPlazas} plazas)`
              : "Hay una solicitud de rebaja";

        return (
          <Card
            key={grupo.map((p) => p.id).join("-")}
            className="space-y-2 border-emerald-200 bg-emerald-50/40"
          >
            <p className="text-base font-semibold text-emerald-950">{titulo}</p>
            <TextoEstado
              porte={porteVista}
              esConductor={false}
              rutaId={rutaId}
              cuantasPlazas={cuantasPlazas}
            />
          </Card>
        );
      })}
    </div>
  );
}
