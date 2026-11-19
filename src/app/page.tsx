import { Libre_Baskerville } from "next/font/google";
import { ButtonLink } from "@/components/ui/Button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HomeSofaHighlight } from "@/components/home/HomeSofaHighlight";
import { BRAND } from "@/lib/brand";

const camaraFont = Libre_Baskerville({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});

const anuncioFont = Libre_Baskerville({
  weight: "700",
  subsets: ["latin"],
});

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
            .portada-rebaja {
              width: 100%;
              max-width: 17.5rem;
            }
            @media (min-width: 768px) {
              .portada-rebaja {
                width: calc(22rem + 2cm);
                max-width: 92vw;
              }
            }
            @media (min-width: 1024px) {
              .portada-rebaja {
                width: calc(36rem + 2cm);
                max-width: 100%;
              }
            }
            .portada-rebaja img.portada-nevera-hero {
              width: 100%;
              max-width: none;
              margin: 0;
            }
            .portada-anuncio {
              color: #9af7ef;
              text-shadow:
                0 0 1px rgba(0, 30, 30, 0.9),
                0 1px 1px rgba(0, 20, 20, 0.75),
                0 0 8px rgba(80, 255, 230, 0.95),
                0 0 18px rgba(0, 210, 190, 0.8);
            }
          `,
        }}
      />
    <div className="space-y-6 px-4 py-4 lg:space-y-0 lg:px-0 lg:py-0">
      <div className="lg:flex lg:min-h-[calc(100dvh-8rem)] lg:flex-col">
        {/* Hero: en PC ocupa la mitad superior de la pantalla */}
        <section className="grid grid-cols-1 items-stretch overflow-visible rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white md:grid-cols-2 lg:min-h-0 lg:flex-[3] lg:rounded-none">
          <div className="flex min-w-0 flex-col p-3 sm:p-6 lg:px-10 lg:pt-4 lg:pb-6 xl:px-16 xl:pt-5 xl:pb-8">
            <div className="mb-3 sm:mb-4 lg:mb-2">
            <div className="flex min-w-0 items-start gap-3">
              <div className="-mt-[4mm] -mb-[4mm] -ml-[4mm] -mr-[4mm] w-[calc(40%+8mm)] max-w-[calc(9rem+8mm)] shrink-0 -translate-x-[4mm] overflow-hidden sm:max-w-[calc(10rem+8mm)] md:w-[calc(46%+8mm)] md:max-w-[calc(16rem+8mm)] lg:max-w-[calc(18rem+8mm)] xl:max-w-[calc(20rem+8mm)]">
                <BrandLogo
                  size="hero"
                  showText={false}
                  onDark
                  plain
                  linked={false}
                  className="w-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm font-bold leading-[1.12] text-white sm:text-base md:text-lg lg:text-2xl xl:text-3xl">
                  <span className="block whitespace-nowrap">Viaja barato.</span>
                  <span className="block whitespace-nowrap">Y con bultos y mascotas.</span>
                </h1>
                <p className="mt-1 text-xs text-emerald-50 sm:text-sm lg:text-base">
                  <span className="lg:block">
                    Conectamos conductores fiables{" "}
                  </span>
                  <span className="lg:block">
                    con quienes necesitan viajar, enviar un paquete o{" "}
                  </span>
                  <span className="lg:block lg:whitespace-nowrap">
                    desplazarse con su mascota compartiendo ruta.
                  </span>
                </p>
              </div>
            </div>
            <p
              className={`${anuncioFont.className} portada-anuncio mt-2 min-w-0 max-w-full text-sm leading-snug sm:text-base`}
            >
              <span className="block lg:whitespace-nowrap">
                📍 Arrancamos en la provincia de Burgos, en la conexión Burgos ↔ Madrid.
              </span>
              <span className="block lg:whitespace-nowrap">
                Y el corredor Madrid ↔ Andalucía es clave ahora, con muchísima demanda.
              </span>
              <span className="block lg:whitespace-nowrap">¡ PUBLICA TU VIAJE!</span>
            </p>
            </div>
            <div className="mt-3 grid gap-2 lg:mb-2 lg:mt-3 lg:max-w-xl">
              <ButtonLink
                href="/rutas/nueva"
                variant="primary"
                fullWidth
                className="!h-auto !items-start !justify-start flex-col gap-1 px-3 py-2.5 text-left"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-amber-200 sm:text-sm">
                  <span className="text-2xl leading-none" aria-hidden>
                    🚚
                  </span>
                  (Soy Conductor)
                </span>
                <span className="text-sm font-semibold leading-snug sm:text-base">
                  PUBLICAR mi ruta con el espacio y asientos libres
                </span>
              </ButtonLink>
              <p className="px-1 text-xs leading-snug text-emerald-50 sm:text-sm">
                Podrás editar el viaje mientras no haya reservas.
              </p>
              <ButtonLink
                href="/ciudad/nueva"
                variant="secondary"
                fullWidth
                className="!h-auto !items-start !justify-start flex-col gap-1 border-white bg-white px-3 py-2.5 text-left text-emerald-950 hover:bg-emerald-50"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-emerald-800 sm:text-sm">
                  <span className="text-2xl leading-none" aria-hidden>
                    🏘️
                  </span>
                  (Soy Conductor)
                </span>
                <span className="text-sm font-semibold leading-snug sm:text-base">
                  PUBLICAR trayecto en mi ciudad
                </span>
              </ButtonLink>
              <p className="px-1 text-lg leading-snug text-white md:hidden">
                Además la App reteiene y custodia el importe del viaje hasta
                confirmar que todo ha ido bien
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center self-stretch px-3 pb-4 pt-1 md:min-h-[14rem] md:px-4 md:pb-3 md:pt-0 lg:min-h-0">
            <div className="portada-rebaja flex flex-col items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BRAND.heroNevera}
                alt=""
                className="portada-nevera-hero"
              />
              <div className="mt-4 w-full md:hidden">
                <ButtonLink
                  href="/bultos/nuevo?entrada=portada"
                  variant="secondary"
                  fullWidth
                  className="!h-auto !items-start !justify-start flex-col gap-1 border-emerald-300 bg-emerald-400 px-3 py-2.5 text-left text-emerald-950 hover:border-emerald-200 hover:bg-emerald-300"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-emerald-900 sm:text-sm">
                    <span className="text-2xl leading-none" aria-hidden>
                      📦
                    </span>
                    (Soy Remitente/Pasajero)
                  </span>
                  <span className="text-sm font-semibold leading-snug sm:text-base">
                    AVISARME si un conductor hace esta ruta
                  </span>
                </ButtonLink>
              </div>
              <div className="mt-8 text-left text-lg leading-snug text-white md:text-xl">
                <p className="font-semibold">
                  <span className="text-[#00b4c4]" aria-hidden>
                    ✓{" "}
                  </span>
                  Usar Transporte Social es gratis
                </p>
                <p className="mt-1 hidden whitespace-nowrap md:block md:-translate-x-[2.5cm]">
                  Además custodiamos el importe del viaje hasta confirmar que todo ha ido bien.
                </p>
              </div>
              <div className="mt-4 hidden w-full md:block">
              <ButtonLink
                href="/bultos/nuevo?entrada=portada"
                variant="secondary"
                fullWidth
                className="!h-auto !items-start !justify-start flex-col gap-1 border-emerald-300 bg-emerald-400 px-3 py-2.5 text-left text-emerald-950 hover:border-emerald-200 hover:bg-emerald-300"
              >
                <span className="flex items-center gap-2 text-xs font-semibold text-emerald-900 sm:text-sm">
                  <span className="text-2xl leading-none" aria-hidden>
                    📦
                  </span>
                  (Soy Remitente/Pasajero)
                </span>
                <span className="text-sm font-semibold leading-snug sm:text-base">
                  AVISARME si un conductor hace esta ruta
                </span>
              </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        {/* Nevera + botones de búsqueda */}
        <section className="mt-0 space-y-0 md:pb-8 lg:flex lg:flex-[2] lg:flex-col lg:justify-start lg:gap-0 lg:px-10 lg:pt-0 lg:pb-12 xl:px-16">
          <HomeSofaHighlight />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-5 lg:gap-5">
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
              href="/ciudad"
              variant="primary"
              fullWidth
              className="!h-auto flex-col gap-1 px-4 py-3"
            >
              <span className="flex w-full items-center justify-center gap-2 text-base font-semibold leading-snug sm:text-lg">
                <span className="text-2xl leading-none sm:text-3xl" aria-hidden>
                  🏘️
                </span>
                Buscar ruta dentro de mi municipio.
              </span>
            </ButtonLink>
          </div>
          <p
            className={`${camaraFont.className} mt-6 text-center text-lg italic leading-snug text-orange-500 sm:mt-8 sm:text-xl`}
          >
            Iniciativa de movilidad con el respaldo institucional de la Cámara
            de Comercio de Burgos.
          </p>
          <img
            src="/brand/logo-camara-burgos.jpg"
            alt="Cámara de Comercio de Burgos"
            className="mx-auto mt-4 block h-auto w-full max-w-[10rem]"
          />
        </section>
      </div>
    </div>
    </>
  );
}
