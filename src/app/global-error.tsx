"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-dvh bg-zinc-50 px-4 py-12 text-zinc-900">
        <div className="mx-auto max-w-lg space-y-4">
          <h1 className="text-2xl font-bold">Ha habido un problema</h1>
          <p className="text-sm text-zinc-600">
            No se ha podido cargar la página. Prueba otra vez.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
