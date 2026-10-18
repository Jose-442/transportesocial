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
  cabeRebaja,
  TEXTO_CANCELAR_TRAMO_SIN_REBAJA,
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
}: {
  porte: PorteRebaja;
  esConductor: boolean;
  rutaId: string | null;
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
          ? "Has indicado que no aceptas la rebaja. El viaje sigue. Quien reservó puede cancelar si quiere."
          : `El conductor no ha aceptado la rebaja. El viaje sigue. ${TEXTO_CANCELAR_TRAMO_SIN_REBAJA}`}
      </p>
    );
  }

  if (!cabeRebaja(porte.salida)) {
    return (
      <p className="text-sm text-zinc-700">
        Ya no se puede bajar el precio. El viaje sigue por lo pagado.
      </p>
    );
  }

  if (!esConductor) {
    return (
      <p className="text-sm text-zinc-700">
        Has pedido una rebaja. El precio no cambia hasta que el conductor
        guarde el precio nuevo o diga que no la acepta.
      </p>
    );
  }

  if (porte.estado === "confirmada") {
    return (
      <p className="text-base text-emerald-900">
        Puedes guardar un precio más bajo debajo.
      </p>
    );
  }

  return (
    <p className="text-base text-emerald-900">
      Cuando aceptes la reserva, podrás guardar un precio más bajo.
    </p>
  );
}

function Formulario({
  porte,
  origen,
  destino,
  rutaId,
}: {
  porte: PorteRebaja;
  origen: string;
  destino: string;
  rutaId: string | null;
}) {
  const router = useRouter();
  const minimo = usePrecioMinimoCarretera(origen, destino);
  const [netoTexto, setNetoTexto] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const enviando = useRef(false);
  const neto = Number(netoTexto.replace(",", "."));
  const visible = Number.isFinite(neto) && neto > 0 ? calcPrecioConComision(neto) : 0;
  const diferencia = porte.precioTotal - visible;
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
        Precio pagado: {formatEur(porte.precioTotal)}. El precio no cambia
        hasta que guardes uno más bajo.
      </p>
      {minimo.texto ? (
        <p className="text-sm text-zinc-600">{minimo.texto}</p>
      ) : null}
      {minimo.error ? (
        <p className="text-sm text-red-600">{minimo.error}</p>
      ) : null}
      <Input
        label="Precio neto (€)"
        name="precio_neto"
        type="number"
        step="0.01"
        min="0.01"
        value={netoTexto}
        onChange={(e) => setNetoTexto(e.target.value)}
        required
        hint="Sin los gastos de gestión. Al guardar se devuelve la diferencia."
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
        {loading ? "Guardando…" : "Guardar precio nuevo"}
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
        El viaje sigue. Quien reservó podrá cancelar y recuperar casi todo lo
        pagado (menos lo del banco por la tarjeta).
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
  const pedidos = portes.filter((porte) => porte.pideRebaja);
  if (pedidos.length === 0) return null;

  return (
    <div className="space-y-2">
      {pedidos.map((porte) => {
        const puedeGuardar =
          esConductor &&
          !porte.rebajaEn &&
          !porte.rebajaRechazadaEn &&
          porte.estado === "confirmada" &&
          cabeRebaja(porte.salida);
        const puedeRechazar =
          esConductor &&
          Boolean(porte.esTramo) &&
          !porte.rebajaEn &&
          !porte.rebajaRechazadaEn &&
          (porte.estado === "confirmada" ||
            porte.estado === "pendiente_aprobacion") &&
          cabeRebaja(porte.salida);
        return (
          <Card
            key={porte.id}
            className="space-y-2 border-emerald-200 bg-emerald-50/40"
          >
            <p className="text-base font-semibold text-emerald-950">
              {porte.rebajaEn
                ? "Rebaja aplicada"
                : porte.rebajaRechazadaEn
                  ? "Rebaja no aceptada"
                  : "Hay una solicitud de rebaja"}
            </p>
            <TextoEstado porte={porte} esConductor={esConductor} rutaId={rutaId} />
            {puedeGuardar ? (
              <Formulario
                porte={porte}
                origen={origen}
                destino={destino}
                rutaId={rutaId}
              />
            ) : null}
            {puedeRechazar ? <BotonRechazarTramo reservaId={porte.id} /> : null}
          </Card>
        );
      })}
    </div>
  );
}
