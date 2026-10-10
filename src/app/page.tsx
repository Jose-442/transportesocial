import { ButtonLink } from "@/components/ui/Button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HomeSofaHighlight } from "@/components/home/HomeSofaHighlight";
import { HomeSubscriptionBanner } from "@/components/home/HomeSubscriptionBanner";
import { BRAND, BRAND_TAGLINE } from "@/lib/brand";

export default async function HomePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            img.portada-nevera {
              display: block;
              width: 100%;
              max-width: 17rem;
              height: auto;
              margin: 0 auto;
              padding: 0;
              vertical-align: top;
            }
            @media (min-width: 768px) {
              img.portada-nevera {
                width: calc(30rem + 2cm);
                max-width: none;
              }
            }
            img.portada-nevera-hero {
              display: block;
              width: 100%;
              max-width: 17.5rem;
              height: auto;
              margin: 0 auto;
              padding: 0;
              vertical-align: top;
            }
            @media (min-width: 768px) {
              img.portada-nevera-hero {
                width: calc(22rem + 2cm);
                max-width: 92vw;
              }
            }
            @media (min-width: 1024px) {
              img.portada-nevera-hero {
                width: calc(36rem + 2cm);
                max-width: none;
              }
            }
          `,
        }}
      />
    <div className="space-y-6 px-4 py-4 lg:space-y-0 lg:px-0 lg:py-0">
      <div className="lg:flex lg:min-h-[calc(100dvh-8rem)] lg:flex-col">
        {/* Hero: en PC ocupa la mitad superior de la pantalla */}
        <section className="grid grid-cols-1 items-stretch overflow-visible rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white md:grid-cols-2 md:overflow-hidden lg:min-h-0 lg:flex-[3] lg:rounded-none">
          <div className="flex min-w-0 flex-col p-3 sm:p-6 lg:p-10 xl:p-12">
            <div className="mb-3 flex min-w-0 flex-nowrap items-start gap-3 sm:mb-4 lg:mb-6">
              <div className="w-[40%] max-w-[9rem] shrink-0 overflow-hidden sm:max-w-[10rem] md:w-[46%] md:max-w-[16rem] lg:max-w-[18rem] xl:max-w-[20rem]">
                <BrandLogo
                  size="hero"
                  showText={false}
                  onDark
                  plain
                  linked={false}
                  className="w-full"
                />
              </div>
              <h1 className="min-w-0 flex-1 text-sm font-bold leading-[1.12] text-white sm:text-base md:pl-3 md:text-lg lg:text-2xl xl:text-3xl">
                <span className="block">Viaja barato, además lleva</span>
                <span className="block">o que te lleven bultos y mascotas</span>
                <span className="block">compartiendo ruta</span>
              </h1>
            </div>
            <p className="text-xs text-emerald-100/90 sm:text-sm lg:text-base">
              {BRAND_TAGLINE}
            </p>
            <p className="mt-2 text-xs text-emerald-50 sm:mt-3 sm:text-sm lg:mt-4 lg:text-base">
              Cercano, práctico, útil. Conectamos conductores con espacio libre
              con personas que necesitan enviar un bulto, viajar o desplazarse
              con su mascota.
            </p>
            <div className="mt-4 grid flex-1 content-end gap-2 sm:mt-5 sm:gap-3 lg:mt-8 lg:max-w-xl lg:gap-4">
              <ButtonLink
                href="/rutas"
                variant="secondary"
                fullWidth
                className="!h-auto flex-col gap-1 px-4 py-3"
              >
                <span className="flex w-full items-center justify-center gap-2 text-base font-semibold leading-snug sm:text-lg">
                  <span className="text-2xl leading-none sm:text-3xl" aria-hidden>
                    🔍
                  </span>
                  Buscar conductor con viaje previsto
                </span>
              </ButtonLink>
              <ButtonLink
                href="/bultos"
                variant="secondary"
                fullWidth
                className="!h-auto flex-col gap-1 border-white/30 bg-white/10 px-4 py-3 text-white hover:bg-white/20"
              >
                <span className="flex w-full items-center justify-center gap-2 text-base font-semibold leading-snug sm:text-lg">
                  <span className="text-2xl leading-none sm:text-3xl" aria-hidden>
                    📦
                  </span>
                  Buscar porte o pasajeros
                </span>
              </ButtonLink>
            </div>
          </div>
          <div className="flex items-center justify-center self-stretch px-3 pb-4 pt-1 md:min-h-[14rem] md:px-0 md:pb-0 md:pt-0 lg:min-h-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BRAND.heroNevera}
              alt="Portes para todos… o casi todos"
              className="portada-nevera-hero"
            />
          </div>
        </section>

        {/* Nevera + botones de búsqueda */}
        <section className="mt-0 space-y-0 md:pb-8 lg:flex lg:flex-[2] lg:flex-col lg:justify-start lg:gap-0 lg:px-10 lg:pt-0 lg:pb-12 xl:px-16">
          <HomeSofaHighlight />
          <div className="mb-4 lg:mb-5">
            <HomeSubscriptionBanner />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:gap-5">
            <ButtonLink
              href="/rutas/nueva"
              variant="primary"
              fullWidth
              className="min-h-[6.5rem] !items-start !justify-start flex-col gap-4 px-3 py-4 text-left sm:min-h-[7.5rem] sm:gap-5 sm:px-4"
            >
              <span className="text-sm font-semibold text-amber-200 sm:text-base">
                🚚 (Soy Conductor)
              </span>
              <span className="text-base font-semibold leading-snug sm:text-lg">
                PUBLICAR mi vehículo y ruta disponible
              </span>
            </ButtonLink>
            <ButtonLink
              href="/bultos/nuevo?entrada=portada"
              variant="secondary"
              fullWidth
              className="min-h-[6.5rem] !items-start !justify-start flex-col gap-4 border-emerald-500 bg-emerald-400 px-3 py-4 text-left text-emerald-950 hover:border-emerald-600 hover:bg-emerald-500 sm:min-h-[7.5rem] sm:gap-5 sm:px-4"
            >
              <span className="text-sm font-semibold text-emerald-900 sm:text-base">
                📦 (Soy Remitente/Pasajero)
              </span>
              <span className="text-base font-semibold leading-snug sm:text-lg">
                PUBLICAR mi necesidad de transporte
              </span>
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
