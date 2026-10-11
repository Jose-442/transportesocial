"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TEXTO_DECLARACION_PORTE } from "@/lib/porte-legal";

const FOTO_MAX_BYTES = 5 * 1024 * 1024;

function FotoCarga({
  titulo,
  obligatoria,
  name,
}: {
  titulo: string;
  obligatoria?: boolean;
  name: string;
}) {
  const galeriaRef = useRef<HTMLInputElement>(null);
  const camaraRef = useRef<HTMLInputElement>(null);
  const envioRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  function guardarEnvio(file: File | null) {
    const destino = envioRef.current;
    if (!destino) return;
    const lista = new DataTransfer();
    if (file) lista.items.add(file);
    destino.files = lista.files;
  }

  function applyFile(file: File | null) {
    if (!file) {
      guardarEnvio(null);
      setPreview(null);
      setAviso(null);
      return;
    }
    if (file.size > FOTO_MAX_BYTES) {
      guardarEnvio(null);
      setPreview(null);
      setAviso("Cada foto no puede superar 5 MB.");
      return;
    }
    guardarEnvio(file);
    setAviso(null);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-2 rounded-xl border border-zinc-200 p-3">
      <span className="text-sm font-medium text-zinc-800">
        {titulo}
        {obligatoria ? " (obligatoria)" : " (opcional)"}
      </span>
      <div className="flex items-start gap-4">
        {preview ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            <Image
              src={preview}
              alt={titulo}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => camaraRef.current?.click()}
            >
              Hacer foto
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => galeriaRef.current?.click()}
            >
              Galería
            </Button>
          </div>
          {aviso ? <p className="text-sm text-red-700">{aviso}</p> : null}
        </div>
      </div>
      <input
        ref={envioRef}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
      />
      <input
        ref={camaraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (galeriaRef.current) galeriaRef.current.value = "";
          applyFile(file);
        }}
      />
      <input
        ref={galeriaRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (camaraRef.current) camaraRef.current.value = "";
          applyFile(file);
        }}
      />
    </div>
  );
}

export function DeclaracionPorteCampos({
  declaracionAceptada,
  onDeclaracion,
  faltaFoto = false,
  faltaDeclaracion = false,
}: {
  declaracionAceptada: boolean;
  onDeclaracion: (value: boolean) => void;
  faltaFoto?: boolean;
  faltaDeclaracion?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <span className="text-sm font-medium text-zinc-800">
          Fotos de la carga (máximo 2)
        </span>
        <div
          data-fotos-carga
          className="grid grid-cols-1 gap-3 md:grid-cols-2"
          {...(faltaFoto ? { "data-campo-error": "" } : {})}
        >
          <FotoCarga titulo="Foto 1" obligatoria name="foto" />
          <FotoCarga titulo="Foto 2" name="foto_2" />
        </div>
        <p className="text-xs text-zinc-500">
          Puedes hacerla con la cámara o elegirla de la galería. JPG, PNG o
          WebP. Máx. 5 MB cada una.
        </p>
      </div>

      <label
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm"
        {...(faltaDeclaracion ? { "data-campo-error": "" } : {})}
      >
        <input
          type="checkbox"
          name="declaracion_aceptada"
          value="1"
          checked={declaracionAceptada}
          onChange={(e) => onDeclaracion(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-emerald-600"
        />
        <span className="leading-snug text-zinc-800">
          {TEXTO_DECLARACION_PORTE}
        </span>
      </label>
    </div>
  );
}
