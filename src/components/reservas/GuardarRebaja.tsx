"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { guardarRebajaReserva } from "@/actions/rebaja";
import { usePrecioMinimoCarretera } from "@/components/rutas/usePrecioMinimoCarretera";
import { calcPrecioConComision, formatEur } from "@/lib/pricing";
import { mensajePrecioPorDebajo, precioVisiblePorDebajo } from "@/lib/precio-minimo";
import { cabeRebaja } from "@/lib/reservas/rebaja";

export type PorteRebaja = {
  id: string;
  precioTotal: number;
  pideRebaja: boolean;
  rebajaEn: string | null;
  rebajaEur: number | null;
  estado: string;
  salida: string;
  descripcion: string | null;
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
          <Link
            href={`/rutas/${rutaId}`}
            className="inline-flex text-sm font-semibold text-emerald-700"
          >
            Si quieres volver a publicar el hueco que queda, hazlo en el viaje.
          </Link>
        ) : null}
      </div>
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
        guarde el precio nuevo.
      </p>
    );
  }

  if (porte.estado === "confirmada") {
    return (
      <p className="text-sm font-medium text-emerald-900">
        Hay una solicitud de rebaja. Puedes guardar un precio más bajo
        debajo.
      </p>
    );
  }

  return (
    <p className="text-sm font-medium text-emerald-900">
      Hay una solicitud de rebaja. Cuando aceptes la reserva, podrás guardar
      un precio más bajo.
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
        <p className="text-sm text-zinc-600">
          Si lo guardas y quieres publicar el hueco que queda, lo haces en el{" "}
          <Link href={`/rutas/${rutaId}`} className="font-semibold text-emerald-700">
            viaje
          </Link>
          .
        </p>
      ) : null}
    </form>
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
          porte.estado === "confirmada" &&
          cabeRebaja(porte.salida);
        return (
          <Card
            key={porte.id}
            className="space-y-2 border-emerald-200 bg-emerald-50/40"
          >
            <p className="text-sm font-semibold text-emerald-950">
              {porte.rebajaEn
                ? "Rebaja aplicada"
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
          </Card>
        );
      })}
    </div>
  );
}
