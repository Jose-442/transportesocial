import { BRAND } from "@/lib/brand";

const FRASE_TITULAR_CLASS =
  "min-w-0 break-words px-2 text-center text-lg font-bold leading-snug text-emerald-900 sm:text-xl lg:text-left lg:text-2xl xl:text-3xl";

export function HomeSofaHighlight() {
  return (
    <div className="flex min-w-0 max-w-full flex-col items-stretch gap-6 overflow-x-hidden px-2 py-2 sm:gap-7 lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:px-0 lg:py-4">
      <p className={`${FRASE_TITULAR_CLASS} lg:flex-1`}>
        Compartiendo gastos
        <br />
        Más económico, más
        <br />
        eficiente, menos tiempo
        <br />
        Ahorra en cada trayecto
      </p>
      <div className="mx-auto flex w-full max-w-[19rem] shrink-0 justify-center leading-none sm:max-w-[22rem] lg:max-w-[36rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND.heroSofa}
          alt="Transporte Social — compartiendo ruta con humor"
          className="mx-auto h-auto w-full max-w-[19rem] rounded-2xl sm:max-w-[22rem] lg:max-w-[36rem]"
        />
      </div>
      <p className={`${FRASE_TITULAR_CLASS} lg:flex-1`}>
        De tú a tú
        <br />
        Pasajeros, bultos y mascotas
        <br />
        Tienes también la opción
        <br />
        de solicitar una rebaja
        <br />
        Y la diferencia vuelve a tu bolsillo
      </p>
    </div>
  );
}
