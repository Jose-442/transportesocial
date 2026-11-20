import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import {
  AUTO_DELIVERED_AFTER_ARRIVAL_HOURS,
  CANCELACION_ANTICIPADA_HORAS,
  COMMISSION_PERCENT_LABEL,
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

      <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
        <Image
          src={BRAND.jose}
          alt="Jose"
          width={319}
          height={290}
          unoptimized
          className="h-auto w-52 shrink-0"
        />
        <div className="space-y-4 text-base leading-relaxed sm:text-lg">
          <p>
            Hola, me llamo Jose y este es un pequeño resumen de mi historia y
            de por qué creé Transporte Social
          </p>
          <p>
            Llevo más de 34 años conociendo personalmente el transporte
            profesional y sé de primera mano las carencias, los sobrecostes,
            los tiempos de espera y los problemas que surgen en el día a día.
            Por eso creé Transporte Social: para aprovechar trayectos que ya se
            van a hacer, conectar a personas con conductores fiables para
            pasajeros, bultos o mascotas, y proteger el dinero de todos hasta
            que el viaje o el envío salga bien.
          </p>
        </div>
      </div>

      <Image
        src={BRAND.quienesSomosNevera}
        alt="Portes para todos… o casi todos"
        width={1200}
        height={800}
        unoptimized
        className="mx-auto mb-6 h-auto w-full max-w-2xl"
      />

      <div className="mb-6 space-y-4 text-base leading-relaxed sm:text-lg">
        <p>
          Somos una plataforma que pone en contacto a quien necesita viajar,
          enviar un bulto o ir con su mascota con un conductor particular que
          ya tenía previsto hacer ese viaje y tiene sitio libre.
        </p>
        <p>
          El viaje se iba a hacer de todas formas, así que el porte sale
          económico, rápido y sin un desplazamiento añadido. El conductor
          publica su ruta. Quien necesita la plaza, el bulto o la mascota no
          publica un anuncio: deja un aviso y reserva cuando un conductor
          publique esa ruta.
        </p>
        <p>
          Además, si tu envío es más pequeño que el espacio publicado, la App
          te da la opción de solicitar una rebaja en el precio y el conductor
          tiene esa opción de ajustar el precio hasta 48 horas antes del
          viaje.
        </p>
        <p>¡Así de fácil! Un éxito para ambas partes.</p>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Tarifas y condiciones</h2>
      <p className="mb-6 text-base leading-relaxed text-zinc-700 sm:text-lg">
        Usar Transporte Social es gratuito: registrarse, publicar viajes y
        buscar no tiene coste. El importe del viaje se paga siempre por
        adelantado y queda retenido hasta confirmar que el viaje o el porte ha
        salido bien. Entonces se aplica un {COMMISSION_PERCENT_LABEL} para
        cubrir los gastos de gestión de la plataforma.
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
              Reservas el viaje que ya publicó el conductor. Si necesitas una
              plaza, un bulto o llevar una mascota, dejas un aviso y reservas
              cuando un conductor publique esa ruta. No se publica un encargo
              ni se reciben ofertas sobre él.
            </li>
            <li>
              Si el conductor no tiene activada la aceptación automática, dispone
              de <strong>{CONDUCTOR_APPROVAL_HOURS} horas</strong> para aceptar o
              rechazar la solicitud.
            </li>
            <li>
              Mientras esperas su respuesta puedes cancelar. En la primera
              hora desde el pago te devolvemos el viaje menos la pequeña tarifa
              del banco por la tarjeta. Pasada esa hora te devolvemos el viaje
              y nos quedamos el {COMMISSION_PERCENT_LABEL} de gastos de
              gestión. Si el conductor rechaza o no responde en plazo, se
              reembolsa el 100 %.
            </li>
            <li>
              Cuando ya está confirmada, si aún no ha pasado una hora desde el
              pago y cancelas tú, te devolvemos el viaje menos la pequeña tarifa
              del banco por la tarjeta. Pasada esa hora, si cancelas con más de{" "}
              <strong>{CANCELACION_ANTICIPADA_HORAS} horas</strong> de
              antelación, te devolvemos el viaje y nos quedamos el{" "}
              {COMMISSION_PERCENT_LABEL} de gastos de gestión; el conductor no
              cobra. Si cancelas a menos de{" "}
              <strong>{CANCELACION_ANTICIPADA_HORAS} horas</strong> de la
              salida, te devolvemos la mitad del viaje, el conductor se queda
              la otra mitad y nos quedamos el {COMMISSION_PERCENT_LABEL}. A
              partir de la hora de salida ya no se puede cancelar. Si cancela
              el conductor, te devolvemos el 100 %, también los gastos de
              gestión.
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
            <li>
              El chat oculta teléfonos, correos, enlaces y formas de pago fuera
              de la App (por ejemplo WhatsApp o Bizum). El viaje se paga solo
              aquí. Si se intenta cobrar o pagar por otro sitio, el equipo puede
              cerrar la cuenta.
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
              después de la hora de salida indicada en la reserva.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            Plazos, reclamaciones y pago al conductor
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Desde la <strong>hora de salida</strong> indicada en la reserva,
              quien
              envía dispone de{" "}
              <strong>{DISPUTE_WINDOW_HOURS} horas</strong> para pulsar
              «Informar de un problema» en Mis viajes.
            </li>
            <li>
              Si no hay reclamación en ese plazo, el pago correspondiente al
              conductor se libera automáticamente (menos los gastos de gestión de
              la plataforma).
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
          Ir a la portada
        </Link>
      </p>
    </div>
  );
}
