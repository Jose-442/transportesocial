import { BRAND } from "@/lib/brand";

const FRASE_IZQ =
  "Mismo viaje, más económico, menos emisiones: envía lo que necesites de forma sostenible.";
const FRASE_IZQ_SUB = "Puedes también acompañar a tu envío.";
const FRASE_DER =
  "Compartiendo gastos: economía colaborativa, de tú a tú, 100% legal, no hay que declarar nada.";

const FRASE_TITULAR_CLASS =
  "min-w-0 break-words px-2 text-center text-lg font-bold leading-snug text-emerald-900 sm:text-xl lg:text-left lg:text-2xl xl:text-3xl";

function FraseTitular({ children }: { children: string }) {
  return (
    <p className={`${FRASE_TITULAR_CLASS} lg:flex-1`}>
      !!{children}!!
    </p>
  );
}

export function HomeSofaHighlight() {
  return (
    <div className="flex min-w-0 max-w-full flex-col items-stretch gap-4 overflow-x-hidden px-1 sm:gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-6 lg:px-0">
      <p className={`${FRASE_TITULAR_CLASS} lg:flex-1`}>
        !!{FRASE_IZQ}!!
        <br />
        {FRASE_IZQ_SUB}
      </p>
      <div className="mx-auto flex w-full max-w-[17rem] shrink-0 justify-center leading-none sm:max-w-[19rem] lg:max-w-[32rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BRAND.heroSofa}
          alt="Transporte Social — compartiendo ruta con humor"
          className="mx-auto h-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:max-w-[32rem]"
        />
      </div>
      <FraseTitular>{FRASE_DER}</FraseTitular>
    </div>
  );
}
