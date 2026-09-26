"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { enviarOferta } from "@/actions/ofertas";
import { calcOfertaTotales, incluyeBulto, numPasajeros } from "@/lib/solicitud-viaje";
import { formatEur } from "@/lib/pricing";
import type { TipoSolicitud } from "@/lib/solicitud-viaje";
import { cuentaHrefConVolver } from "@/lib/cuenta-volver";
import { sincronizarCuentaBorradores } from "@/lib/draft-cuenta";
import {
  clearDraft,
  clearOfertaPostLogin,
  consumeOfertaPostLogin,
  DRAFT_KEYS,
  loadOfertaBackup,
  loadOwnedDraft,
  type OfertaDraft,
  saveOwnedDraft,
  setOfertaPostLogin,
} from "@/lib/form-draft";

const DESDE_VEHICULO_KEY = "transporte-social-desde-vehiculo";

const EMPTY_OFERTA_DRAFT: OfertaDraft = {
  precio_neto_bulto: "",
  precio_neto_plaza: "",
  plazas_ofrecidas: "",
  mensaje: "",
};

type OfertaFormState = OfertaDraft;

export function OfertaForm({
  bultoId,
  tipoSolicitud,
  isLoggedIn,
  mostrarAvisoPerfil = false,
  mostrarAvisoVehiculo = false,
}: {
  bultoId: string;
  tipoSolicitud: TipoSolicitud;
  isLoggedIn: boolean;
  mostrarAvisoPerfil?: boolean;
  mostrarAvisoVehiculo?: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const draftKey = DRAFT_KEYS.oferta(bultoId);
  const conBulto = incluyeBulto(tipoSolicitud);
  const plazas = numPasajeros(tipoSolicitud);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [mostrarBannerPostLogin, setMostrarBannerPostLogin] = useState(false);
  const [volviendoDelVehiculo, setVolviendoDelVehiculo] = useState(false);
  const [form, setForm] = useState<OfertaFormState>(() => ({
    ...EMPTY_OFERTA_DRAFT,
    plazas_ofrecidas: String(plazas),
  }));
  const uidRef = useRef("");

  useEffect(() => {
    const desdeQuery =
      new URLSearchParams(window.location.search).get("desde") === "vehiculo";
    const desdeStorage = sessionStorage.getItem(DESDE_VEHICULO_KEY) === "1";
    if (desdeQuery || desdeStorage) {
      setVolviendoDelVehiculo(true);
      sessionStorage.removeItem(DESDE_VEHICULO_KEY);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void sincronizarCuentaBorradores().then((uid) => {
      if (cancelled) return;
      uidRef.current = uid;
      const draft =
        loadOwnedDraft<OfertaDraft>(draftKey, uid) ??
        (loadOfertaBackup(bultoId) as OfertaDraft | null);
      if (draft) {
        const ofrecidas = parseInt(draft.plazas_ofrecidas ?? "", 10);
        setForm({
          precio_neto_bulto: draft.precio_neto_bulto ?? "",
          precio_neto_plaza: draft.precio_neto_plaza ?? "",
          plazas_ofrecidas:
            plazas > 0 &&
            Number.isInteger(ofrecidas) &&
            ofrecidas >= 1 &&
            ofrecidas <= plazas
              ? String(ofrecidas)
              : String(plazas),
          mensaje: draft.mensaje ?? "",
        });
        // Reasigna el borrador a la cuenta por si venía del backup de sesión.
        saveOwnedDraft(
          draftKey,
          {
            precio_neto_bulto: draft.precio_neto_bulto ?? "",
            precio_neto_plaza: draft.precio_neto_plaza ?? "",
            plazas_ofrecidas:
              plazas > 0 &&
              Number.isInteger(ofrecidas) &&
              ofrecidas >= 1 &&
              ofrecidas <= plazas
                ? String(ofrecidas)
                : String(plazas),
            mensaje: draft.mensaje ?? "",
          },
          uid
        );
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [draftKey, plazas, bultoId]);

  useEffect(() => {
    if (!ready) return;
    saveOwnedDraft(draftKey, form, uidRef.current);
  }, [ready, form, draftKey]);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    if (consumeOfertaPostLogin(bultoId)) {
      setMostrarBannerPostLogin(true);
    }
  }, [ready, isLoggedIn, bultoId]);

  const botonArriba = ready && volviendoDelVehiculo && !mostrarAvisoVehiculo;

  useEffect(() => {
    if (!botonArriba) return;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [botonArriba]);

  const netoBulto = parseFloat(form.precio_neto_bulto) || 0;
  const netoPlaza = parseFloat(form.precio_neto_plaza) || 0;
  const plazasOfrecidas =
    plazas > 0 ? parseInt(form.plazas_ofrecidas, 10) || plazas : 0;
  const totales =
    (conBulto && netoBulto > 0) || (plazas > 0 && netoPlaza > 0)
      ? calcOfertaTotales(
          tipoSolicitud,
          netoBulto,
          netoPlaza,
          plazas > 0 ? plazasOfrecidas : undefined
        )
      : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isLoggedIn) {
      // Guarda ya lo rellenado antes de ir a entrar/registrarse.
      saveOwnedDraft(draftKey, form, uidRef.current);
      setOfertaPostLogin(bultoId, form);
      router.push(`/login?redirect=${encodeURIComponent(`/bultos/${bultoId}`)}`);
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("precio_neto_bulto", form.precio_neto_bulto);
    formData.set("precio_neto_plaza", form.precio_neto_plaza);
    if (plazas > 0) {
      formData.set("plazas_ofrecidas", form.plazas_ofrecidas);
    }
    formData.set("mensaje", "");
    formData.set("anuncio_bulto_id", bultoId);

    const result = await enviarOferta(formData);

    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }

    clearDraft(draftKey);
    clearOfertaPostLogin(bultoId);
    setMostrarBannerPostLogin(false);
    setVolviendoDelVehiculo(false);
    setForm({ ...EMPTY_OFERTA_DRAFT, plazas_ofrecidas: String(plazas) });
    router.refresh();
  }

  const botonEnviar = (
    <Button type="submit" fullWidth disabled={loading}>
      {loading ? "Enviando…" : "Enviar propuesta"}
    </Button>
  );

  return (
    <form
      ref={formRef}
      id="proponer-precio"
      onSubmit={handleSubmit}
      className="scroll-mt-4 space-y-4"
    >
      {mostrarBannerPostLogin && (
        <div className="rounded-xl bg-emerald-50 px-3 py-2.5 text-base text-emerald-900">
          Ya has entrado. Revisa el precio y pulsa «Enviar propuesta» para que
          el solicitante la reciba.
        </div>
      )}
      {botonArriba && (
        <div className="space-y-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-base text-emerald-900">
          <p>
            Vehículo guardado. Revisa el precio y pulsa «Enviar propuesta».
          </p>
          {botonEnviar}
        </div>
      )}
      {conBulto && (
        <Input
          name="precio_neto_bulto"
          label="Tu precio por el bulto (€)"
          type="text"
          inputMode="decimal"
          placeholder="Ej. 25"
          required
          value={form.precio_neto_bulto}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, precio_neto_bulto: e.target.value }))
          }
        />
      )}
      {plazas > 0 && (
        <>
          <Input
            name="precio_neto_plaza"
            label="Pon precio por pasajero (€)"
            type="text"
            inputMode="decimal"
            placeholder="Ej. 25"
            required
            value={form.precio_neto_plaza}
            hint={`Nº de plazas solicitadas para pasajeros en este viaje (${plazas})`}
            hintClassName="text-sm text-zinc-500"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, precio_neto_plaza: e.target.value }))
            }
          />
          <Select
            name="plazas_ofrecidas"
            label="Plazas de pasajero que puedes llevar en este viaje"
            value={form.plazas_ofrecidas}
            required
            options={Array.from({ length: plazas }, (_, i) => {
              const n = i + 1;
              return {
                value: String(n),
                label: n === 1 ? "1 pasajero" : `${n} pasajeros`,
              };
            })}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, plazas_ofrecidas: e.target.value }))
            }
          />
        </>
      )}
      {totales && (
        <div className="space-y-1 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-900">
          {totales.desglose.precio_total_bulto != null && (
            <p>
              Bulto: <strong>{formatEur(totales.desglose.precio_total_bulto)}</strong>
            </p>
          )}
          {totales.desglose.num_plazas > 0 &&
            totales.desglose.precio_total_plaza_unitario != null && (
              <p>
                {totales.desglose.num_plazas} pasajero
                {totales.desglose.num_plazas !== 1 ? "s" : ""} ×{" "}
                {formatEur(totales.desglose.precio_total_plaza_unitario)} ={" "}
                <strong>
                  {formatEur(
                    totales.desglose.precio_total_plaza_unitario *
                      totales.desglose.num_plazas
                  )}
                </strong>
              </p>
            )}
          <p>
            Total a pagar por el solicitante:{" "}
            <strong>{formatEur(totales.precio_total)}</strong>
          </p>
          {totales.desglose.plazas_ofrecidas <
            totales.desglose.plazas_solicitadas && (
            <p className="text-amber-800">
              En el anuncio se solicitan {totales.desglose.plazas_solicitadas}{" "}
              pasajeros; tu propuesta cubre {totales.desglose.plazas_ofrecidas}.
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {mostrarAvisoPerfil && (
        <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-base text-zinc-600">
          <p>
            Consejo: quien publica el bulto verá tu perfil. Foto y una breve
            presentación suelen ayudar a que acepten tu propuesta.
          </p>
          <Link
            href="/cuenta"
            className="mt-1 inline-block font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Completar mi perfil
          </Link>
        </div>
      )}
      {mostrarAvisoVehiculo && !volviendoDelVehiculo && (
        <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-base text-zinc-600">
          <p>
            Para enviar propuestas necesitas indicar marca, modelo, año y
            distintivo ambiental de tu vehículo.
          </p>
          <Link
            href={cuentaHrefConVolver(`/bultos/${bultoId}`)}
            className="mt-1 inline-block font-semibold text-emerald-700 hover:text-emerald-800"
            onClick={() => {
              sessionStorage.setItem(DESDE_VEHICULO_KEY, "1");
            }}
          >
            Datos de mi vehículo
          </Link>
        </div>
      )}
      {!isLoggedIn && (
        <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-base text-zinc-600">
          Para proponer precio necesitas entrar o registrarte. Así el solicitante
          verá quién eres y tu oferta.
        </div>
      )}
      {!botonArriba && botonEnviar}
    </form>
  );
}
