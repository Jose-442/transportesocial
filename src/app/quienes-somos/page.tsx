import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import {
  AUTO_DELIVERED_AFTER_ARRIVAL_HOURS,
  CONDUCTOR_APPROVAL_HOURS,
  DISPUTE_WINDOW_HOURS,
} from "@/lib/constants";

export const metadata = { title: "Quiénes somos y cómo funcionamos" };

export default function QuienesSomosPage() {
  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-8 text-zinc-900">
      <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
        Quiénes somos y cómo funcionamos
      </h1>

      <Image
        src={BRAND.quienesSomosNevera}
        alt="Portes para todos… o casi todos"
        width={1200}
        height={800}
        unoptimized
        className="mx-auto mb-6 h-auto w-full max-w-2xl"
      />

      <p className="mb-6 text-base leading-relaxed sm:text-lg">
        Somos una plataforma que conecta a conductores que tienen un viaje ya
        programado y disponen de espacio libre con personas que necesitan
        enviar algo muy voluminoso, haciendo de esa conexion que un porte sea
        economico, rapido, eficiente y sostenible, con cero emisiones añadidas,
        ya que el viaje se iba ha hacer de todas maneras. También en nuestra
        plataforma puede publicar su solicitud la persona que necesita hacer un
        porte para que los conductores que hagan esa ruta puedan ofrecerle un
        precio. Así de fácil, un éxito para ambas partes.
      </p>

      <Image
        src={BRAND.quienesSomosCamion}
        alt="Transporte Social — compartiendo ruta"
        width={1200}
        height={800}
        unoptimized
        className="mx-auto mb-6 h-auto w-full max-w-2xl"
      />

      <h2 className="mb-3 text-lg font-semibold">Tarifas y condiciones</h2>
      <p className="mb-6 text-base leading-relaxed text-zinc-700 sm:text-lg">
        Para el mantenimiento de la plataforma y como aportación para el uso de
        Transporte Social, la suscripción requiere una pequeña aportación de 95
        céntimos/mes. Incluye 3 publicaciones GRATIS; a partir de la 4.ª
        publicación: 90 céntimos por publicación. En los viajes concertados a
        través de la plataforma se aplica una comisión del 22 %.
      </p>

      <h2 className="mb-3 text-lg font-semibold">
        Condiciones de uso
      </h2>
      <p className="mb-4 text-base leading-relaxed text-zinc-700">
        Resumen de las reglas principales. El texto legal completo está en{" "}
        <Link
          href="/terminos"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Términos y Condiciones y Política de Privacidad
        </Link>
        .
      </p>

      <div className="mb-6 space-y-4 text-base leading-relaxed text-zinc-700">
        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">Reservas y pago</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El importe del viaje se paga <strong>siempre por adelantado</strong>{" "}
              al solicitar la reserva. Los fondos quedan retenidos de forma
              segura hasta que el envío se complete según estas condiciones.
            </li>
            <li>
              Puedes reservar un viaje ya publicado (Rutas) o publicar un bulto
              y aceptar una oferta de un conductor (Bultos).
            </li>
            <li>
              Si el conductor no tiene activada la aceptación automática, dispone
              de <strong>{CONDUCTOR_APPROVAL_HOURS} horas</strong> para aceptar o
              rechazar la solicitud.
            </li>
            <li>
              Mientras esperas su respuesta, puedes{" "}
              <strong>cancelar en cualquier momento</strong> con reembolso del
              100 %. Si el conductor rechaza o no responde en plazo, también se
              reembolsa el 100 %.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            Comunicación y privacidad
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El chat interno solo se abre cuando la reserva está{" "}
              <strong>confirmada y pagada</strong>. Antes de eso no hay contacto
              directo entre las partes.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">Durante el viaje</h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El conductor puede marcar el envío como «En camino» y «Entregado».
            </li>
            <li>
              Si olvida marcar «Entregado», el sistema lo registra
              automáticamente a las{" "}
              <strong>
                {AUTO_DELIVERED_AFTER_ARRIVAL_HOURS} horas
              </strong>{" "}
              después de la hora teórica de llegada indicada en la reserva.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            Plazos, reclamaciones y pago al conductor
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Desde la <strong>hora teórica de llegada</strong> del bulto, quien
              envía dispone de{" "}
              <strong>{DISPUTE_WINDOW_HOURS} horas</strong> para pulsar
              «Informar de un problema» en Mis viajes.
            </li>
            <li>
              Si no hay reclamación en ese plazo, el pago correspondiente al
              conductor se libera automáticamente (menos la comisión de la
              plataforma).
            </li>
            <li>
              Al abrir una reclamación, el dinero queda <strong>congelado</strong>{" "}
              hasta que el equipo revise el caso (de forma manual al principio),
              incluyendo el historial del chat interno.
            </li>
            <li>
              Tanto quien envía el bulto como el conductor pueden abrir una
              disputa si hay un problema.
            </li>
          </ul>
        </section>
      </div>

      <p className="mb-6 text-center text-sm text-zinc-600">
        <Link
          href="/terminos"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Ver Términos y Condiciones y Política de Privacidad completos
        </Link>
      </p>

      <p className="mt-8 text-center">
        <Link
          href="/"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Volver a inicio
        </Link>
      </p>
    </div>
  );
}
