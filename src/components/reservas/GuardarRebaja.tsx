"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { guardarRebajaReserva, rechazarRebajaTramo } from "@/actions/rebaja";
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
          ? "Has indicado que no aceptas la rebaja. La reserva sigue. Quien reservó puede cancelar si quiere."
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

  return (
    <p className="text-base text-emerald-900">
      {cuantasPlazas > 1
        ? `Si aceptas la rebaja, guarda un precio más bajo para las ${cuantasPlazas} plazas juntas. Si no la aceptas, la reserva sigue por lo pagado.`
        : "Si aceptas la rebaja, guarda un precio más bajo. Si no la aceptas, la reserva sigue por lo pagado."}
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
}: {
  porte: PorteRebaja;
  origen: string;
  destino: string;
  rutaId: string | null;
  cuantasPlazas: number;
  precioPagadoTotal: number;
  etiquetaBoton: string;
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
      <p className="text-sm text-zinc-700">
        Precio pagado
        {cuantasPlazas > 1 ? ` (todas las plazas)` : ""}:{" "}
        {formatEur(precioPagadoTotal)}. El precio no cambia hasta que guardes
        uno más bajo.
      </p>
      {minimo.texto ? (
        <p className="text-sm text-zinc-600">{minimo.texto}</p>
      ) : null}
      {minimo.error ? (
        <p className="text-sm text-red-600">{minimo.error}</p>
      ) : null}
      <Input
        label={
          cuantasPlazas > 1
            ? "Precio neto total (€)"
            : "Precio neto (€)"
        }
        name="precio_neto"
        type="number"
        step="0.01"
        min="0.01"
        value={netoTexto}
        onChange={(e) => setNetoTexto(e.target.value)}
        required
        hint={
          cuantasPlazas > 1
            ? "Sin gastos de gestión. Es el total de todas las plazas de esta solicitud."
            : "Sin los gastos de gestión. Al guardar se devuelve la diferencia."
        }
      />
      {visible > 0 ? (
        <p className="text-sm text-zinc-700">
          El otro pagaría {formatEur(visible)}.
          {diferencia >= 0.01
            ? ` Se le devuelven ${formatEur(diferencia)}.`
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

function BotonRechazarTramo({ reservaId }: { reservaId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enviando = useRef(false);

  async function onClick() {
    if (enviando.current) return;
    enviando.current = true;
    setLoading(true);
    setError(null);
    const fd = new FormData();
    fd.set("reserva_id", reservaId);
    const result = await rechazarRebajaTramo(fd);
    if (result.error) {
      setError(result.error);
      enviando.current = false;
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        fullWidth
        disabled={loading}
        onClick={() => void onClick()}
      >
        {loading ? "Guardando…" : "No acepto la rebaja"}
      </Button>
      <p className="text-xs text-zinc-600">
        La reserva queda aceptada por lo pagado. Quien reservó podrá cancelar
      </p>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
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
          // Si alguna del grupo sigue pendiente de aceptar reserva, el formulario espera.
          estado: grupo.every((p) => p.estado === "confirmada")
            ? "confirmada"
            : grupo.some((p) => p.estado === "pendiente_aprobacion")
              ? "pendiente_aprobacion"
              : porte.estado,
        };
        const pendienteGrupo = grupo.every(
          (p) => !p.rebajaEn && !p.rebajaRechazadaEn
        );
        const puedeDecidirRebaja =
          esConductor &&
          pendienteGrupo &&
          !porteVista.rebajaEn &&
          !porteVista.rebajaRechazadaEn &&
          (porteVista.estado === "confirmada" ||
            porteVista.estado === "pendiente_aprobacion");
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
            <p className="text-base font-semibold text-emerald-950">
              {titulo}
            </p>
            {esConductor &&
            (porteVista.esTramo || grupo.some((p) => p.esTramo)) &&
            pendienteGrupo &&
            !porteVista.rebajaEn &&
            !porteVista.rebajaRechazadaEn ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-emerald-950">
                  {TEXTO_REBAJA_TRAMO_CONDUCTOR}
                </p>
                <p className="text-sm font-medium text-emerald-950">
                  {TEXTO_PLAZA_TRAMO_ANADIR_CONDUCTOR}
                </p>
              </div>
            ) : null}
            {cuantasPlazas > 1 && pendienteGrupo ? (
              <ul className="list-inside list-disc text-sm text-zinc-700">
                {grupo.map((p) => (
                  <li key={p.id}>
                    {p.descripcion?.trim() || "Plaza"} · {formatEur(p.precioTotal)}
                  </li>
                ))}
              </ul>
            ) : null}
            <TextoEstado
              porte={porteVista}
              esConductor={esConductor}
              rutaId={rutaId}
              cuantasPlazas={cuantasPlazas}
            />
            {puedeDecidirRebaja ? (
              <Formulario
                porte={porte}
                origen={origen}
                destino={destino}
                rutaId={rutaId}
                cuantasPlazas={cuantasPlazas}
                precioPagadoTotal={precioPagadoTotal}
                etiquetaBoton={
                  porteVista.estado === "pendiente_aprobacion"
                    ? "Aceptar rebaja"
                    : "Guardar precio nuevo"
                }
              />
            ) : null}
            {puedeDecidirRebaja && Boolean(porteVista.esTramo) ? (
              <BotonRechazarTramo reservaId={porte.id} />
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
