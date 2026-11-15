import { RutaCard } from "@/components/rutas/RutaCard";
import { BuscarCiudadForm } from "@/components/ciudad/BuscarCiudadForm";
import {
  busquedaCiudadCompleta,
  listarRutasCiudad,
  parseFiltrosCiudad,
} from "@/lib/ciudad/listado";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "Buscar trayecto en mi ciudad" };

export default async function CiudadPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filtros = parseFiltrosCiudad(params);
  const completa = busquedaCiudadCompleta(filtros);

  let rutas: Awaited<ReturnType<typeof listarRutasCiudad>>["rutas"] = [];
  let errorLista = "";
  if (completa) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const resultado = await listarRutasCiudad(supabase, filtros);
    errorLista = resultado.error ?? "";
    rutas = user
      ? resultado.rutas.filter((ruta) => ruta.user_id !== user.id)
      : resultado.rutas;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold leading-snug text-zinc-900 sm:text-2xl">
          Buscar trayecto en mi ciudad
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Burgos, Aranda de Duero, Miranda de Ebro, Logroño, Palencia,
          Santander, Torrelavega, Castro-Urdiales, Vitoria-Gasteiz, Pamplona,
          Tudela, León, San Andrés del Rabanedo, Ponferrada, Soria, Segovia,
          Valladolid, Zamora, Zaragoza, Gijón, Lugo, Ourense, Pontevedra, Vigo,
          Vilagarcía de Arousa, A Coruña, Santiago de Compostela, Ferrol, Narón,
          Oleiros, Bilbao y Barakaldo.
          Eliges barrio o polígono.
          La calle se concreta en el chat.
        </p>
      </div>

      <BuscarCiudadForm inicial={filtros} />

      {errorLista ? (
        <p className="text-sm text-red-700">{errorLista}</p>
      ) : completa ? (
        <>
          <p className="text-sm font-medium text-zinc-700">
            {rutas.length === 1
              ? "1 trayecto encontrado"
              : `${rutas.length} trayectos encontrados`}
          </p>
          {rutas.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No hay trayectos con sitio libre en ese recorrido.
            </p>
          ) : (
            <ul className="space-y-3">
              {rutas.map((ruta) => (
                <li key={ruta.id}>
                  <RutaCard ruta={ruta} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-sm text-zinc-500">
          Elige salida y llegada para ver los trayectos. El día es opcional.
        </p>
      )}
    </div>
  );
}
