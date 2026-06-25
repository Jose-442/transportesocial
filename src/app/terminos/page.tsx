import Link from "next/link";
import {
  APP_NAME,
  AUTO_DELIVERED_AFTER_ARRIVAL_HOURS,
  CONDUCTOR_APPROVAL_HOURS,
  DISPUTE_WINDOW_HOURS,
  FREE_PUBLICATIONS,
  MAX_ASIENTOS_POR_VIAJE,
  PUBLICATION_FEE_EUR,
  REVIEW_WINDOW_DAYS,
  SUBSCRIPTION_MONTHLY_EUR,
} from "@/lib/constants";
import { LEGAL_TITULAR } from "@/lib/legal-info";
import { formatEur } from "@/lib/pricing";
import { TerminosVolverRegistro } from "@/components/legal/TerminosVolverRegistro";

export const metadata = { title: "Términos y privacidad" };

const comisionPct = "22 %";

export default function TerminosPage() {
  const { nombre, nif, domicilio, email } = LEGAL_TITULAR;
  const fechaActualizacion = "25 de junio de 2026";

  return (
    <div className="mx-auto max-w-3xl bg-white px-4 py-8 text-zinc-900">
      <div className="mb-8 lg:flex lg:items-start lg:gap-6">
        <TerminosVolverRegistro />
        <div className="min-w-0 flex-1">
          <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            Términos y privacidad
          </h1>
          <p className="text-center text-sm text-zinc-600">
            Última actualización: {fechaActualizacion}
          </p>
        </div>
      </div>

      <div className="space-y-8 text-base leading-relaxed text-zinc-700">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Términos y Condiciones de Uso de {APP_NAME}
          </h2>
          <p>
            El presente documento establece los Términos y Condiciones de Uso
            (en adelante, los «Términos») que regulan el acceso y uso de la
            plataforma web <strong>{APP_NAME}</strong> (en adelante, la
            «Plataforma»), operada por <strong>{nombre}</strong> (en adelante,
            el «Titular»)
            {nif ? `, con NIF ${nif}` : ""}
            {domicilio ? ` y domicilio en ${domicilio}` : ""}.
          </p>
          <p className="mt-3">
            Al registrarse y utilizar la Plataforma, usted adquiere la condición
            de Usuario y acepta estos Términos. Según el uso, podrá actuar como{" "}
            <strong>Emisor</strong> (quien envía un bulto o reserva espacio),{" "}
            <strong>Conductor</strong> (quien publica un trayecto y ofrece
            espacio en su vehículo) o <strong>Acompañante</strong> (quien viaja
            en el vehículo del Conductor en una plaza reservada). Si no está de
            acuerdo, deberá abstenerse de utilizar la Plataforma.
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            1. Naturaleza de la Plataforma (mero intermediario)
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              {APP_NAME} es una plataforma tecnológica que pone en contacto a
              particulares que desean enviar un objeto o enser personal con otros
              particulares que realizan un trayecto por su cuenta y disponen de
              espacio libre en su vehículo.
            </li>
            <li>
              <strong>{APP_NAME} NO</strong> es una empresa de transportes,
              agencia de mudanzas, taxi ni VTC. No presta servicios de
              transporte, no posee vehículos ni contrata a los Conductores. Su
              función es la intermediación tecnológica entre particulares (P2P).
            </li>
            <li>
              El acuerdo sobre el traslado del bulto y/o la compartición de
              gastos se celebra únicamente entre Emisor y Conductor. El Titular
              permanece ajeno a esa relación contractual.
            </li>
            <li>
              La Plataforma ofrece dos modalidades:{" "}
              <strong>Viajes propuestos por conductores</strong> (el Conductor
              publica un viaje con espacio para un bulto principal) y{" "}
              <strong>Propuestas de personas que necesitan enviar bulto</strong>{" "}
              (el Emisor publica una solicitud y los Conductores pueden ofertar
              un precio).
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            2. Prohibición de lucro (compartición de gastos)
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El servicio del Conductor se realiza a título particular y
              colaborativo. Queda prohibida la obtención de beneficio económico
              neto o lucro con fines comerciales de transporte.
            </li>
            <li>
              Las aportaciones del Emisor o reservante están destinadas a
              sufragar costes del trayecto (combustible, peajes, desgaste
              proporcional del vehículo, etc.), dentro de los límites legales.
            </li>
            <li>
              El Titular podrá limitar viajes, bultos e importes máximos para
              cumplir la normativa española de transportes. El incumplimiento es
              responsabilidad exclusiva del Conductor.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            3. Viaje con acompañante
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Conductor puede ofrecer, al publicar un viaje, entre 1 y{" "}
              {MAX_ASIENTOS_POR_VIAJE} plazas de acompañante (máximo{" "}
              {MAX_ASIENTOS_POR_VIAJE} por trayecto).
            </li>
            <li>
              Las plazas se reservan y pagan por adelantado en la Plataforma, con
              el mismo flujo de reserva, pago retenido, aprobación del Conductor
              (si aplica) y chat interno que el resto de reservas.
            </li>
            <li>
              El Conductor garantiza plazas homologadas y libres, seguro
              obligatorio en vigor que cubra ocupantes, y cumplimiento de la
              normativa de tráfico.
            </li>
            <li>
              El Titular no responde por daños personales, accidentes, retrasos
              o altercados ocurridos dentro del vehículo durante el trayecto.
            </li>
            <li>
              Tras reservarse el bulto principal, el Conductor puede ofrecer
              capacidad adicional (más bultos o más plazas), siempre dentro del
              límite de {MAX_ASIENTOS_POR_VIAJE} plazas de acompañante en total
              por trayecto.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            4. Daños, pérdidas o roturas
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Emisor es responsable de declarar con veracidad dimensiones,
              peso y contenido del bulto, y de embalarlo adecuadamente.
            </li>
            <li>
              El Conductor debe custodiar el bulto con diligencia desde la
              recogida hasta la entrega.
            </li>
            <li>
              {APP_NAME} no responde por pérdida, robo, extravío, rotura o
              deterioro de los bultos. Las reclamaciones sobre el estado del
              bulto deben resolverse entre Emisor y Conductor, sin perjuicio del
              mecanismo de disputa sobre fondos retenidos.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            5. Reservas, pagos, fianzas y disputas
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El importe se abona <strong>siempre por adelantado</strong> al
              solicitar la reserva. Los fondos quedan retenidos de forma segura
              hasta que se cumplan las condiciones de liberación.
            </li>
            <li>
              Si el Conductor no tiene activada la aceptación automática,
              dispone de <strong>{CONDUCTOR_APPROVAL_HOURS} horas</strong> para
              aceptar o rechazar la solicitud desde el pago.
            </li>
            <li>
              Mientras esté pendiente de aprobación, el cliente puede{" "}
              <strong>cancelar en cualquier momento</strong> con reembolso del{" "}
              <strong>100 %</strong>. Si el Conductor rechaza o no responde en{" "}
              {CONDUCTOR_APPROVAL_HOURS} horas, también se reembolsa el 100 %.
            </li>
            <li>
              El <strong>chat interno</strong> solo se habilita cuando la
              reserva está confirmada y pagada.
            </li>
            <li>
              El Conductor puede marcar el envío como «En camino» y «Entregado».
              Si no marca «Entregado», el sistema puede registrar la entrega
              automáticamente a las{" "}
              <strong>{AUTO_DELIVERED_AFTER_ARRIVAL_HOURS} horas</strong> de la
              hora teórica de llegada indicada en la reserva.
            </li>
            <li>
              Desde la <strong>hora teórica de llegada</strong>, quien envía o
              reserva dispone de{" "}
              <strong>{DISPUTE_WINDOW_HOURS} horas</strong> para pulsar
              «Informar de un problema» en Mis viajes.
            </li>
            <li>
              Si no se abre reclamación en ese plazo, el importe correspondiente
              al Conductor (menos la comisión del {comisionPct}) se libera
              automáticamente a su saldo en la Plataforma.
            </li>
            <li>
              Si se abre una reclamación, el pago queda congelado. Emisor y
              Conductor pueden aportar pruebas (fotos, chat interno, etc.). El
              equipo de {APP_NAME} actuará como árbitro y resolverá de forma
              vinculante en la Plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            6. Tarifas de la Plataforma
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Suscripción:{" "}
              <strong>{formatEur(SUBSCRIPTION_MONTHLY_EUR)}/mes</strong>.
            </li>
            <li>
              Publicaciones: <strong>{FREE_PUBLICATIONS} publicaciones
              gratuitas</strong> incluidas; a partir de la siguiente,{" "}
              <strong>{formatEur(PUBLICATION_FEE_EUR)}</strong> por publicación
              (viaje propuesto por conductor o propuesta de envío de bulto).
            </li>
            <li>
              Viajes concertados: comisión del <strong>{comisionPct}</strong>{" "}
              sobre el importe acordado, incluida en el precio visible al
              reservar.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            7. Reseñas «a ciegas»
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Tras finalizar el viaje y liberarse el pago, las partes disponen
              de <strong>{REVIEW_WINDOW_DAYS} días</strong> para valorar con
              estrellas y comentario.
            </li>
            <li>
              Ninguna parte ve la reseña recibida hasta que publica la suya, o
              hasta que venza el plazo de {REVIEW_WINDOW_DAYS} días.
            </li>
            <li>
              El Titular puede retirar reseñas que incumplan normas básicas de
              respeto.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            8. Disposiciones generales
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Titular puede modificar estos Términos; la fecha de última
              actualización reflejará el cambio.
            </li>
            <li>Legislación aplicable: España.</li>
            <li>
              Contacto:{" "}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {email}
              </a>
            </li>
          </ul>
        </section>

        <section id="privacidad" className="scroll-mt-20 border-t border-zinc-200 pt-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900">
            Política de Privacidad y Protección de Datos (RGPD)
          </h2>

          <h3 className="mb-2 font-semibold text-zinc-900">
            1. Responsable del tratamiento
          </h3>
          <ul className="mb-4 list-none space-y-1 pl-0">
            <li>
              <strong>Denominación:</strong> {nombre}
            </li>
            {nif ? (
              <li>
                <strong>NIF:</strong> {nif}
              </li>
            ) : null}
            {domicilio ? (
              <li>
                <strong>Domicilio:</strong> {domicilio}
              </li>
            ) : null}
            <li>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${email}`}
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                {email}
              </a>
            </li>
          </ul>

          <h3 className="mb-2 font-semibold text-zinc-900">
            2. Finalidad y base legal
          </h3>
          <p className="mb-3">
            Tratamos los datos personales para las siguientes finalidades, con
            base en la ejecución del contrato (aceptación de estos Términos) y,
            cuando proceda, en el consentimiento del Usuario:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5">
            <li>Gestión de registros, perfiles y cuenta de usuario.</li>
            <li>
              Tramitación de reservas, publicación de viajes propuestos por
              conductores y de propuestas de envío de bulto, plazas de
              acompañante, chat interno y pasarela de pagos.
            </li>
            <li>Gestión de disputas, reseñas y notificaciones del servicio.</li>
            <li>
              Facturación de la suscripción y de las publicaciones de pago.
            </li>
          </ul>

          <h3 className="mb-2 font-semibold text-zinc-900">
            3. Encargados y conservación
          </h3>
          <ul className="mb-4 list-disc space-y-2 pl-5">
            <li>
              Los pagos se procesan a través de proveedores como Stripe, que
              actúan como encargados del tratamiento según su propia política de
              privacidad.
            </li>
            <li>
              Los datos de reservas, chat y transacciones se conservan el tiempo
              necesario para prestar el servicio, resolver disputas y cumplir
              obligaciones legales.
            </li>
          </ul>

          <h3 id="cookies" className="mb-2 scroll-mt-20 font-semibold text-zinc-900">
            4. Cookies
          </h3>
          <p className="mb-4">
            Utilizamos cookies y almacenamiento local estrictamente necesarios
            para el funcionamiento de la Plataforma (por ejemplo, mantener la
            sesión iniciada con Supabase). Las cookies o tecnologías analíticas
            no esenciales solo se activarán si usted pulsa «Aceptar todo» en el
            aviso de cookies. Si pulsa «Rechazar todo», la web seguirá
            funcionando con las cookies técnicas imprescindibles. Puede cambiar
            de opinión eliminando la clave{" "}
            <code className="rounded bg-zinc-100 px-1 text-xs">
              transporte-social-cookie-consent
            </code>{" "}
            del almacenamiento de su navegador; el aviso volverá a mostrarse.
          </p>

          <h3 className="mb-2 font-semibold text-zinc-900">
            5. Baja de cuenta y conservación de datos
          </h3>
          <p className="mb-4">
            Puede solicitar la eliminación de su cuenta desde{" "}
            <strong>Mi cuenta → Eliminar mi cuenta</strong>. Si no tiene
            reservas, disputas, viajes o anuncios activos ni saldo pendiente,
            se procederá al borrado. Si tiene historial de viajes, se
            anonimizará su perfil y se bloqueará el acceso, conservando los
            datos mínimos necesarios para el historial de transacciones,
            facturación y resolución de disputas durante los plazos legalmente
            exigibles (habitualmente hasta 6 años en materia fiscal y contractual,
            según la normativa aplicable).
          </p>

          <h3 className="mb-2 font-semibold text-zinc-900">
            6. Derechos del usuario
          </h3>
          <p>
            Puede ejercer los derechos de acceso, rectificación, supresión,
            oposición, limitación del tratamiento y portabilidad (incluida la
            descarga de datos desde Mi cuenta) escribiendo a{" "}
            <a
              href={`mailto:${email}`}
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {email}
            </a>
            . También puede presentar una reclamación ante la Agencia Española
            de Protección de Datos (www.aepd.es).
          </p>
        </section>
      </div>

      <p className="mt-10 text-center">
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
