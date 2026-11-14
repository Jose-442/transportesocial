"use client";

import { useState } from "react";
import { crearAlertaViaje } from "@/actions/alertas-viaje";
import { Button } from "@/components/ui/Button";
import { DatePickerInput } from "@/components/ui/PickerInput";
import { MunicipioAutocomplete } from "@/components/ui/MunicipioAutocomplete";

export function AvisoPlazaForm() {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const [listo, setListo] = useState(false);
  const [loading, setLoading] = useState(false);

  async function dejarAviso() {
    if (loading) return;
    setLoading(true);
    setError("");
    const datos = new FormData();
    datos.set("origen", origen);
    datos.set("destino", destino);
    datos.set("fecha", fecha);
    const result = await crearAlertaViaje(datos);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setListo(true);
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-zinc-900">
        Plaza, bulto o mascota
      </h2>
      <p className="text-sm leading-snug text-zinc-600">
        No se publica un anuncio y ningún conductor puede hacerte una oferta.
        Dejas un aviso con la salida, el destino y el día. Cuando un conductor
        publique esa ruta por su cuenta, te avisamos por correo y en el móvil
        para que reserves en su viaje. El bulto o la mascota se describen al
        reservar, en ese viaje.
      </p>
      {listo ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Aviso guardado. Te avisaremos por correo y en el móvil si un conductor publica este viaje.
        </p>
      ) : (
        <>
          <MunicipioAutocomplete
            name="origen"
            label="Salida"
            value={origen}
            onChange={setOrigen}
          />
          <MunicipioAutocomplete
            name="destino"
            label="Destino"
            value={destino}
            onChange={setDestino}
            incluirFrontera
          />
          <DatePickerInput label="Día" value={fecha} onChange={setFecha} required />
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="button" fullWidth disabled={loading} onClick={() => void dejarAviso()}>
            {loading ? "Guardando…" : "Avisarme cuando un conductor publique"}
          </Button>
        </>
      )}
    </div>
  );
}
