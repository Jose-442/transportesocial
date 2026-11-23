import { Libre_Baskerville } from "next/font/google";
import { ButtonLink } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";

const camaraFont = Libre_Baskerville({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
});

/**
 * Portada = mockup (diseno/mockup-portada-propuesta.html) con enlaces reales.
 */
export default async function HomePage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .portada-mock { background: #047857; }

            .portada-hero {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              padding: 20px 16px 24px;
              /* Un poco más claro que antes (#065f46) */
              background: linear-gradient(145deg, #059669, #047857);
              color: #fff;
            }
            @media (min-width: 768px) {
              .portada-hero {
                grid-template-columns: 1fr 1.08fr;
                gap: 28px;
                padding: 16px 40px 0;
                align-items: stretch;
                /* Exacto la 1ª pantalla bajo la cabecera; la barra fija no tapa nada */
                height: calc(100dvh - 2.75rem);
                min-height: calc(100dvh - 2.75rem);
                max-height: calc(100dvh - 2.75rem);
                box-sizing: border-box;
                overflow: hidden;
              }
            }
            @media (min-width: 1280px) {
              .portada-hero {
                padding-left: 56px;
                padding-right: 56px;
              }
            }

            .portada-hero-izq {
              min-width: 0;
              display: flex;
              flex-direction: column;
            }
            @media (min-width: 768px) {
              .portada-hero-izq {
                align-self: start;
              }
            }

            .portada-logo-row {
              display: flex;
              gap: 16px;
              align-items: flex-start;
              margin-bottom: 0;
              min-width: 0;
            }

            /* Solo aviso + 3 botones (NO logo ni título) */
            .portada-izq-baja {
              margin-top: 0;
            }
            @media (min-width: 768px) {
              .portada-izq-baja {
                margin-top: 1cm;
                transform: translateY(-1.2cm);
              }
            }

            /* Logo: caja 242 (no empuja layout); imagen +3 mm a cada lado */
            .portada-logo {
              width: 242px;
              max-width: 242px;
              flex-shrink: 0;
              position: relative;
              z-index: 2;
              transform: translateY(2mm);
              overflow: visible;
            }
            .portada-logo img {
              display: block;
              width: calc(242px + 6mm);
              max-width: none;
              height: auto;
              margin-left: -3mm;
              margin-top: -3mm;
            }

            .portada-titulos {
              min-width: 0;
              flex: 1;
              padding-top: 4px;
              margin-left: 20mm;
            }
            .portada-hero h1 {
              margin: 0 0 8px;
              font-family: "Segoe UI", system-ui, sans-serif;
              font-size: calc(clamp(1.1rem, 2.2vw, 1.85rem) + 3pt);
              line-height: 1.12;
              font-weight: 800;
            }
            .portada-hero h1 span {
              display: block;
              white-space: nowrap;
            }
            .portada-lead {
              margin: 0;
              font-size: calc(14px + 2pt);
              line-height: 1.4;
              color: #ecfdf5;
              max-width: 34ch;
              font-family: "Segoe UI", system-ui, sans-serif;
            }

            .portada-prioridad {
              margin: 0 0 12px;
              padding: 12px 14px;
              border-radius: 12px;
              background: rgba(255,255,255,.1);
              border: 1px solid rgba(255,255,255,.18);
              font-family: "Segoe UI", system-ui, sans-serif;
              font-size: calc(13px + 2pt);
              line-height: 1.4;
              color: #e6fffa;
              max-width: 520px;
            }
            .portada-prioridad span { display: block; }
            @media (min-width: 768px) {
              .portada-prioridad span {
                white-space: nowrap;
              }
            }
            .portada-prioridad strong {
              display: block;
              margin-top: 6px;
              letter-spacing: .03em;
              color: #fff;
              font-size: calc(14px + 2pt);
              white-space: nowrap;
            }

            .portada-hint {
              margin: 0 0 8px;
              font-size: calc(13px + 2pt);
              font-weight: 600;
              color: #fff;
            }
            .portada-hint-soft {
              margin: 0;
              font-size: calc(12px + 2pt);
              color: #d1fae5;
              font-weight: 400;
            }

            .portada-acciones {
              display: grid;
              gap: 14px;
              max-width: 440px;
            }
            .portada-acciones a {
              display: flex !important;
              align-items: center;
              justify-content: flex-start !important;
              gap: 10px;
              width: 100%;
              text-align: left !important;
              border-radius: 14px !important;
              padding: 13px 16px !important;
              font-size: calc(15px + 2pt) !important;
              font-weight: 700 !important;
              min-height: 0 !important;
              box-shadow: 0 6px 16px rgba(0,0,0,.12);
            }
            .portada-btn-aviso > span:first-child {
              font-size: calc(12px + 2pt) !important;
            }
            .portada-btn-viaje {
              background: #10b981 !important;
              color: #052e1c !important;
              border: none !important;
            }
            .portada-btn-viaje:hover { background: #34d399 !important; }
            .portada-btn-muni {
              background: #fff !important;
              color: #064e3b !important;
              border: none !important;
            }
            .portada-btn-muni:hover { background: #ecfdf5 !important; }
            .portada-btn-aviso {
              background: #34d399 !important;
              color: #064e3b !important;
              border: 1px solid #6ee7b7 !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 2px !important;
            }
            .portada-btn-aviso:hover { background: #6ee7b7 !important; }
            .portada-icon { font-size: 22px; line-height: 1; }

            /* Foto + texto: abajo de la 1ª pantalla; el texto SIEMPRE visible encima de la barra */
            .portada-visual {
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              gap: 10px;
              min-width: 0;
            }
            @media (min-width: 768px) {
              .portada-visual {
                padding-top: 0;
                /* Hueco = altura de la barra fija; el texto queda a ras, sin taparse */
                padding-bottom: 5.5rem;
                height: 100%;
                min-height: 0;
                max-height: 100%;
                justify-content: flex-end;
                box-sizing: border-box;
              }
            }
            .portada-foto {
              background: #0f3d2e;
              border-radius: 18px;
              border: 1px solid rgba(255,255,255,.2);
              overflow: hidden;
              padding: 8px;
              display: grid;
              place-items: center;
              min-height: 0;
            }
            @media (min-width: 768px) {
              .portada-foto {
                /* Deja sitio al texto «es gratis» debajo */
                max-height: calc(100% - 4.5rem);
              }
            }
            .portada-foto img {
              display: block;
              width: 100%;
              max-width: 40rem;
              height: auto;
            }
            @media (min-width: 768px) {
              .portada-foto img {
                max-width: min(100%, 40rem);
                max-height: 100%;
                width: auto;
                object-fit: contain;
              }
            }
            .portada-gratis {
              font-size: calc(14px + 2pt);
              line-height: 1.35;
              color: #fff;
              padding-bottom: 0;
              flex-shrink: 0;
            }
            .portada-gratis b { color: #5eead4; }

            .portada-banda {
              background: #ecfdf5;
              padding: 40px 16px 28px;
            }
            @media (min-width: 768px) {
              .portada-banda { padding: 48px 48px 36px; }
            }
            .portada-frases {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              align-items: center;
              margin-bottom: 36px;
            }
            @media (min-width: 1024px) {
              .portada-frases {
                grid-template-columns: 1fr auto 1fr;
                gap: 28px;
              }
            }
            .portada-frases p {
              margin: 0;
              font-size: clamp(1.1rem, 2vw, 1.4rem);
              font-weight: 750;
              line-height: 1.25;
              color: #065f46;
              text-align: center;
            }
            @media (min-width: 1024px) {
              .portada-frases p { text-align: left; }
            }
            .portada-sofa {
              margin: 0 auto;
              width: 100%;
              max-width: 22rem;
            }
            @media (min-width: 1024px) {
              .portada-sofa { max-width: 36rem; }
            }
            .portada-sofa img {
              display: block;
              width: 100%;
              height: auto;
              border-radius: 16px;
            }
            .portada-buscar {
              display: grid;
              grid-template-columns: 1fr;
              gap: 16px;
              max-width: 820px;
              margin: 0 auto;
            }
            @media (min-width: 640px) {
              .portada-buscar { grid-template-columns: 1fr 1fr; }
            }
            .portada-buscar a {
              display: flex !important;
              align-items: center;
              justify-content: center !important;
              gap: 10px;
              border-radius: 14px !important;
              padding: 14px 16px !important;
              font-size: 15px !important;
              font-weight: 700 !important;
              min-height: 0 !important;
              box-shadow: none !important;
            }
            .portada-buscar-blanco {
              background: #fff !important;
              color: #065f46 !important;
              border: 1px solid #a7f3d0 !important;
            }
            .portada-buscar-verde {
              background: #059669 !important;
              color: #fff !important;
              border-color: transparent !important;
            }
            .portada-camara {
              text-align: center;
              padding: 28px 24px 40px;
              background: #ecfdf5;
            }
            .portada-camara p { margin: 0 0 14px; }
            .portada-camara img {
              display: block;
              margin: 0 auto;
              width: 100%;
              max-width: 10rem;
              height: auto;
            }
          `,
        }}
      />

      <div className="portada-mock">
        <section className="portada-hero">
          <div className="portada-hero-izq">
            <div className="portada-logo-row">
              <div className="portada-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={BRAND.logo}
                  alt="Transporte Social"
                  width={265}
                  height={265}
                />
              </div>
              <div className="portada-titulos">
                <h1>
                  <span>Viaja barato.</span>
                  <span>Y con bultos y mascotas.</span>
                </h1>
                <p className="portada-lead">
                  Conectamos conductores fiables con quienes necesitan viajar,
                  enviar un paquete o desplazarse con su mascota compartiendo
                  ruta.
                </p>
              </div>
            </div>

            <div className="portada-izq-baja">
              <div className="portada-prioridad">
                <span>
                  Arrancamos en la provincia de Burgos, en la conexión Burgos ↔
                  Madrid.
                </span>
                <span>
                  El corredor Madrid ↔ Andalucía es clave ahora, con muchísima
                  demanda.
                </span>
                <strong>¡PUBLICA TU VIAJE!</strong>
              </div>

              <p className="portada-hint">Anuncia tu espacio y asientos libres</p>
              <div className="portada-acciones">
                <ButtonLink
                  href="/rutas/nueva"
                  variant="primary"
                  fullWidth
                  className="portada-btn-viaje"
                >
                  <span className="portada-icon" aria-hidden>
                    🚚
                  </span>
                  Publicar viaje de una localidad a otra
                </ButtonLink>
                <p className="portada-hint-soft">
                  Podrás editar el viaje mientras no haya reservas.
                </p>
                <ButtonLink
                  href="/ciudad/nueva"
                  variant="secondary"
                  fullWidth
                  className="portada-btn-muni"
                >
                  <span className="portada-icon" aria-hidden>
                    🏘️
                  </span>
                  PUBLICAR ruta dentro de mi municipio
                </ButtonLink>
                <ButtonLink
                  href="/bultos/nuevo?entrada=portada"
                  variant="secondary"
                  fullWidth
                  className="portada-btn-aviso"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
                    <span className="portada-icon" aria-hidden>
                      📦
                    </span>
                    (Soy Remitente/Pasajero)
                  </span>
                  <span>AVISARME si un conductor hace esta ruta</span>
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="portada-visual">
            <div className="portada-foto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND.heroNevera} alt="" />
            </div>
            <div className="portada-gratis">
              <b>✓</b> Usar Transporte Social es gratis
              <br />
              Además custodiamos el importe del viaje hasta confirmar que todo
              ha ido bien.
            </div>
          </div>
        </section>

        <section className="portada-banda">
          <div className="portada-frases">
            <p>
              Compartiendo gastos
              <br />
              Más económico, más eficiente, menos tiempo
              <br />
              Ahorra en cada trayecto
            </p>
            <div className="portada-sofa">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BRAND.heroSofa}
                alt="Transporte Social — compartiendo ruta con humor"
              />
            </div>
            <p>
              De tú a tú
              <br />
              Pasajeros, bultos y mascotas
              <br />
              Tienes también la opción de solicitar una rebaja
              <br />
              Y la diferencia vuelve a tu bolsillo
            </p>
          </div>

          <div className="portada-buscar">
            <ButtonLink
              href="/rutas"
              variant="secondary"
              fullWidth
              className="portada-buscar-blanco"
            >
              <span className="portada-icon" aria-hidden>
                🔍
              </span>
              Buscar viaje de una localidad a otra
            </ButtonLink>
            <ButtonLink
              href="/ciudad"
              variant="primary"
              fullWidth
              className="portada-buscar-verde"
            >
              <span className="portada-icon" aria-hidden>
                🏘️
              </span>
              Buscar ruta dentro de mi municipio
            </ButtonLink>
          </div>
        </section>

        <section className="portada-camara">
          <p
            className={`${camaraFont.className} text-lg italic leading-snug text-orange-500 sm:text-xl`}
          >
            Iniciativa de movilidad con el respaldo institucional de la Cámara
            de Comercio de Burgos.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-camara-burgos.jpg"
            alt="Cámara de Comercio de Burgos"
          />
        </section>
      </div>
    </>
  );
}
