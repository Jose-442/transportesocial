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
      <div className="lg:flex lg:min-h-[calc(100dvh-7rem)] lg:flex-col">
        {/* Hero: en PC ocupa la mitad superior de la pantalla */}
        <section className="grid grid-cols-1 items-stretch overflow-visible rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white md:grid-cols-2 md:overflow-hidden lg:min-h-0 lg:flex-[3] lg:rounded-none">
          <div className="flex min-w-0 flex-col p-3 sm:p-6 lg:p-10 xl:p-12">
            <div className="mb-3 flex min-w-0 flex-nowrap items-start gap-2 sm:mb-4 sm:gap-2 lg:mb-6">
              <div className="w-[38%] max-w-[6.75rem] shrink-0 overflow-hidden sm:max-w-[7.5rem] md:w-[58%] md:max-w-none md:overflow-visible md:origin-left md:scale-110 md:translate-x-[-2cm] md:translate-y-[3mm] lg:max-w-[320px] lg:scale-[1.2] xl:max-w-[360px] xl:scale-[1.3]">
                <div className="origin-top-left -translate-x-[5mm] -translate-y-[2mm] scale-[1.35] md:translate-x-0 md:translate-y-0 md:scale-100">
                  <BrandLogo
                    size="hero"
                    showText={false}
                    onDark
                    plain
                    linked={false}
                    className="w-full"
                  />
                </div>
              </div>
              <h1 className="min-w-0 flex-1 text-sm font-bold leading-[1.12] text-white sm:text-base md:pl-3 md:text-lg lg:text-2xl xl:text-3xl">
                <span className="block">Lleva o envía</span>
                <span className="block">bultos compartiendo</span>
                <span className="block">ruta</span>
              </h1>
            </div>
            <p className="text-xs text-emerald-100/90 sm:text-sm lg:text-base">
              {BRAND_TAGLINE}
            </p>
            <p className="mt-2 text-xs text-emerald-50 sm:mt-3 sm:text-sm lg:mt-4 lg:text-base">
              Cercano, práctico, útil. Conectamos conductores con espacio con
              personas que necesitan enviar algo.
            </p>
            <div className="mt-4 grid flex-1 content-end gap-2 sm:mt-5 sm:gap-3 lg:mt-8 lg:max-w-md lg:gap-4">
              <ButtonLink href="/rutas" variant="secondary" fullWidth>
                Buscar ruta de un conductor con espacio libre
              </ButtonLink>
              <ButtonLink
                href="/bultos"
                variant="secondary"
                fullWidth
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Conductor busca ruta con necesidad de porte y/o pasajero
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
        <section className="mt-0 space-y-0 lg:flex lg:flex-[2] lg:flex-col lg:justify-start lg:gap-0 lg:px-10 lg:py-0 xl:px-16">
          <HomeSofaHighlight />
          <div className="mb-4 lg:mb-5">
            <HomeSubscriptionBanner />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:gap-5">
            <ButtonLink
              href="/suscribir-requerida?dest=%2Frutas%2Fnueva"
              variant="primary"
              fullWidth
              className="min-h-[6.5rem] !items-start !justify-start flex-col gap-4 px-3 py-4 text-left text-sm sm:min-h-[7.5rem] sm:gap-5 sm:px-4 sm:text-base"
            >
              <span className="text-xs font-semibold text-amber-200 sm:text-sm">
                Pulsa aquí para:
              </span>
              <span>
                Conductor, ofrece tu viaje: di el espacio de que dispones y/o
                los asientos que tienes libres y ponle precio
              </span>
            </ButtonLink>
            <ButtonLink
              href="/suscribir-requerida?dest=%2Fbultos%2Fnuevo"
              variant="secondary"
              fullWidth
              className="min-h-[6.5rem] !items-start !justify-start flex-col gap-4 px-3 py-4 text-left text-sm sm:min-h-[7.5rem] sm:gap-5 sm:px-4 sm:text-base"
            >
              <span className="text-xs font-semibold text-zinc-500 sm:text-sm">
                Pulsa aquí para:
              </span>
              <span>Solicitar llevar un bulto y/o viajar de acompañante</span>
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
