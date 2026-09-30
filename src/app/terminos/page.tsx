import Link from "next/link";
import {
  APP_NAME,
  AUTO_DELIVERED_AFTER_ARRIVAL_HOURS,
  CANCELACION_ANTICIPADA_HORAS,
  CONDUCTOR_APPROVAL_HOURS,
  DISPUTE_WINDOW_HOURS,
  COMMISSION_PERCENT_LABEL,
  MAX_ASIENTOS_POR_VIAJE,
  REVIEW_WINDOW_DAYS,
} from "@/lib/constants";
import { LEGAL_TITULAR } from "@/lib/legal-info";
import { TerminosVolverRegistro } from "@/components/legal/TerminosVolverRegistro";

export const metadata = { title: "Términos y privacidad" };

export default function TerminosPage() {
  const { nombre, nif, domicilio, email } = LEGAL_TITULAR;
  const fechaActualizacion = "30 de septiembre de 2026";

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
            Términos y Condiciones Generales de Uso y Contratación de {APP_NAME}
          </h2>
          <p>
            Las presentes Condiciones Generales de Uso y Contratación (en
            adelante, los «Términos») rigen el acceso, navegación y uso del
            sitio web{" "}
            <strong>{APP_NAME}</strong> (en adelante, la «Plataforma»), así como
            la contratación de los servicios tecnológicos prestados a través de
            la misma, operada por <strong>{nombre}</strong> (en adelante, el
            «Titular»)
            {nif ? `, con NIF ${nif}` : ""}
            {domicilio ? ` y domicilio en ${domicilio}` : ""}. Contacto:{" "}
            <a
              href={`mailto:${email}`}
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {email}
            </a>
            .
          </p>
          <p className="mt-3">
            Al registrarse y utilizar la Plataforma, usted adquiere la condición
            de Usuario y acepta estos Términos. Según el uso, podrá actuar como{" "}
            <strong>Emisor / Cliente</strong> (quien envía un bulto o reserva
            espacio), <strong>Conductor</strong> (quien publica un trayecto y
            ofrece espacio en su vehículo) o <strong>Acompañante</strong> (quien
            viaja en una plaza reservada). Si no está de acuerdo, deberá
            abstenerse de utilizar la Plataforma.
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            1. Naturaleza jurídica de la Plataforma (intermediación técnica)
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              {APP_NAME} es una plataforma tecnológica de intermediación que
              pone en contacto a particulares que desean enviar un objeto o
              enser personal con otros particulares que realizan un trayecto por
              su cuenta y disponen de espacio libre en su vehículo.
            </li>
            <li>
              <strong>{APP_NAME} NO</strong> es una empresa de transportes, de
              mensajería, agencia de mudanzas, taxi, VTC ni transitaria. No
              presta servicios de transporte, no posee flota de vehículos ni
              contrata a los Conductores. Su función es la intermediación
              tecnológica entre particulares (P2P).
            </li>
            <li>
              La relación contractual de transporte o compartición de viaje se
              perfecciona única y exclusivamente entre el Cliente/Emisor y el
              Conductor. El Titular es ajeno a esa relación y no asume las
              obligaciones propias del contrato de transporte.
            </li>
            <li>
              La Plataforma ofrece dos modalidades:{" "}
              <strong>Viajes propuestos por conductores</strong> y{" "}
              <strong>Propuestas de personas que necesitan enviar bulto</strong>
              .
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            2. Requisitos de registro, identidad y trazabilidad
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              La creación de cuenta, la publicación de anuncios y la
              contratación de servicios están reservadas a personas físicas
              mayores de <strong>18 años</strong> con plena capacidad legal para
              contratar.
            </li>
            <li>
              Los menores de 18 años podrán viajar como pasajeros únicamente si
              van acompañados en todo momento por un usuario adulto registrado
              (padre, madre, tutor legal o adulto debidamente autorizado) que
              haya realizado la reserva en su nombre y bajo su exclusiva
              responsabilidad.
            </li>
            <li>
              Por seguridad, prevención del fraude y cumplimiento normativo,
              para <strong>pagar un viaje o porte</strong> el Usuario debe tener
              guardados en su cuenta un <strong>teléfono móvil</strong> y un{" "}
              <strong>DNI o NIE</strong> válidos. Estos datos solo los ve el
              propio Usuario (y el Titular cuando la ley lo exija).{" "}
              <strong>No se utiliza verificación por SMS</strong>.
            </li>
            <li>
              Queda prohibido intercambiar datos de contacto directos
              (teléfonos, correos, enlaces a WhatsApp, Bizum u otros) fuera del
              chat interno de la Plataforma. El chat filtra automáticamente ese
              tipo de datos.
            </li>
            <li>
              La Plataforma registra y conserva, conforme a la normativa
              aplicable, datos de trazabilidad necesarios para el servicio y la
              seguridad (entre otros: identidad aportada, comunicaciones
              internas, datos de pago, dirección IP asociada a la sesión cuando
              corresponda, y fotografías de la carga). Ante requerimiento
              legítimo de las Fuerzas y Cuerpos de Seguridad o de la autoridad
              judicial, el Titular facilitará la información legalmente
              exigible.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            3. Prohibición de lucro (compartición de gastos)
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
            4. Condiciones del porte y mercancías
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Cliente/Emisor declara ser propietario o estar autorizado para
              el traslado de los bienes, y se obliga a publicar fotografías
              reales y una descripción fiel de la carga (contenido, tamaño y
              estado). Es el único responsable de la exactitud de esa
              información.
            </li>
            <li>
              El servicio de porte se presta{" "}
              <strong>a pie de vehículo</strong>: recepción y entrega en la vía
              o acceso a pie de calle. El Conductor{" "}
              <strong>no</strong> está obligado a actuar como empresa de
              mudanzas ni a subir o bajar bultos por escaleras, pisos, montajes
              o desmontajes.
            </li>
            <li>
              Queda prohibido transportar, entre otros: drogas o sustancias
              ilícitas; armas, munición, explosivos o mercancías peligrosas;
              dinero en efectivo, divisas, joyas o metales preciosos de valor
              relevante; seres vivos o restos humanos; mercancías de procedencia
              ilícita, robadas o de contrabando; y productos perecederos sin las
              condiciones adecuadas.
            </li>
            <li>
              Al publicar un bulto, el Emisor debe aceptar la declaración de
              responsabilidad que aparece en el formulario de publicación.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            5. Inspección y rechazo en la recogida
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Conductor puede inspeccionar visualmente la carga y solicitar
              la apertura de paquetes o bultos cerrados en el momento de la
              recogida, conforme a la autorización dada por el Emisor al
              publicar.
            </li>
            <li>
              Cuando la reserva está confirmada, el Conductor puede{" "}
              <strong>Confirmar recogida</strong> (carga en el vehículo e inicio
              del viaje) o <strong>Rechazar recogida</strong> indicando un
              motivo, entre otros: la carga no coincide con fotos o descripción;
              no cabe / dimensiones no reales; el Emisor no permite revisar un
              paquete cerrado; o existe sospecha de contenido o procedencia
              ilícita.
            </li>
            <li>
              Si el Conductor rechaza la recogida por uno de esos motivos, se
              cancela la reserva, se inicia el{" "}
              <strong>reembolso del 100 %</strong> al Cliente (incluidos los
              gastos de gestión) y se genera una{" "}
              <strong>alerta de seguridad</strong> para el equipo de la
              Plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            6. Viaje con acompañante
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Conductor puede ofrecer, al publicar un viaje, entre 1 y{" "}
              {MAX_ASIENTOS_POR_VIAJE} plazas de acompañante (máximo{" "}
              {MAX_ASIENTOS_POR_VIAJE} por trayecto).
            </li>
            <li>
              Las plazas se reservan y pagan por adelantado en la Plataforma,
              con el mismo flujo de reserva, pago retenido, aprobación del
              Conductor (si aplica) y chat interno que el resto de reservas.
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
            7. Daños, pérdidas o roturas
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El Emisor es responsable de declarar con veracidad el contenido y
              el tamaño del bulto, y de embalarlo adecuadamente.
            </li>
            <li>
              El Conductor debe custodiar el bulto con diligencia desde la
              recogida hasta la entrega.
            </li>
            <li>
              {APP_NAME} no responde por pérdida, robo, extravío, rotura o
              deterioro de los bultos, ni por la puntualidad o calidad del
              servicio prestado por el Conductor. Las reclamaciones materiales
              deben resolverse entre Emisor y Conductor, sin perjuicio del
              mecanismo de disputa sobre fondos retenidos en la Plataforma.
            </li>
            <li>
              El Titular no será responsable de actos ilícitos cometidos por los
              Usuarios mediante el uso de la Plataforma. La responsabilidad
              recae sobre el Usuario infractor.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            8. Reservas, pagos, cancelaciones y disputas
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              El importe se abona <strong>siempre por adelantado</strong>{" "}
              mediante la pasarela de pago integrada (tarjeta). Queda prohibido
              concertar el pago fuera de la Plataforma (efectivo, Bizum u
              otros). El incumplimiento puede dar lugar a suspensión o baja de
              la cuenta.
            </li>
            <li>
              Los fondos quedan retenidos de forma segura hasta que se cumplan
              las condiciones de liberación al Conductor (entrega o plazo sin
              incidencia, según estas Condiciones).
            </li>
            <li>
              Si el Conductor no tiene activada la aceptación automática,
              dispone de <strong>{CONDUCTOR_APPROVAL_HOURS} horas</strong> para
              aceptar o rechazar la solicitud desde el pago. Mientras esté
              pendiente de aprobación, el Cliente puede cancelar con reembolso
              del <strong>100 %</strong>. Si el Conductor rechaza o no responde
              a tiempo, también se reembolsa el 100 %.
            </li>
            <li>
              Cuando la reserva ya está confirmada: si cancela quien reservó con
              más de <strong>{CANCELACION_ANTICIPADA_HORAS} horas</strong> de
              antelación, se le devuelve el viaje y la Plataforma se queda los
              gastos de gestión del {COMMISSION_PERCENT_LABEL}; el Conductor no
              cobra. Si cancela a menos de{" "}
              <strong>{CANCELACION_ANTICIPADA_HORAS} horas</strong> de la
              salida, se le devuelve la mitad del viaje, el Conductor se queda
              la otra mitad y la Plataforma se queda los gastos de gestión. A
              partir de la hora de salida, quien reservó ya no puede cancelar.
              Si cancela el Conductor después de aceptar (o rechaza la
              recogida), se reembolsa el <strong>100 %</strong>, incluidos los
              gastos de gestión.
            </li>
            <li>
              El <strong>chat interno</strong> solo se habilita cuando la
              reserva está confirmada y pagada.
            </li>
            <li>
              El Conductor puede marcar <strong>Confirmar recogida</strong>{" "}
              (viaje en camino) y <strong>Porte entregado</strong>. Si no marca
              la entrega, el sistema puede registrarla automáticamente a las{" "}
              <strong>{AUTO_DELIVERED_AFTER_ARRIVAL_HOURS} horas</strong> de la
              hora de salida indicada en la reserva.
            </li>
            <li>
              Desde la hora de salida, quien envía o reserva dispone de{" "}
              <strong>{DISPUTE_WINDOW_HOURS} horas</strong> para informar de un
              problema. Si no hay reclamación, el importe del Conductor (menos
              el {COMMISSION_PERCENT_LABEL} de gestión) se libera a su saldo. Si
              hay disputa, el pago queda congelado y el equipo de {APP_NAME}{" "}
              actúa como árbitro en la Plataforma.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            9. Tarifas de la Plataforma
          </h3>
          <p>
            Usar {APP_NAME} es gratuito: registrarse, publicar viajes y buscar
            no tiene coste. El importe del viaje se paga siempre por adelantado
            y queda retenido hasta confirmar que el viaje o el porte ha salido
            bien. Entonces se aplica un {COMMISSION_PERCENT_LABEL} para cubrir
            los gastos de gestión de la plataforma. Ese importe se muestra antes
            de confirmar el pago.
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            10. Reseñas «a ciegas»
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
            11. Protección de datos personales
          </h3>
          <p>
            De conformidad con el RGPD (UE) 2016/679 y la LOPDGDD, los datos
            personales se tratan para gestionar el servicio, la identidad
            aportada, los pagos, la seguridad y los requerimientos legales. Para
            el detalle completo, consulte la{" "}
            <a
              href="#privacidad"
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Política de Privacidad
            </a>{" "}
            más abajo.
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            12. Resolución de litigios en línea
          </h3>
          <p>
            De conformidad con el Art. 14.1 del Reglamento (UE) 524/2013, la
            Comisión Europea facilita una plataforma de resolución de litigios
            en línea (ODR) para desacuerdos en materia de consumo, disponible
            en:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-700 hover:text-emerald-800 break-all"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            .
          </p>
        </section>

        <section>
          <h3 className="mb-2 font-semibold text-zinc-900">
            13. Legislación aplicable y jurisdicción
          </h3>
          <ul className="list-disc space-y-2 pl-5">
            <li>Estas Condiciones se rigen por la legislación española.</li>
            <li>
              Para controversias con consumidores, serán competentes los
              Juzgados y Tribunales del domicilio del consumidor, conforme a la
              normativa de consumidores y usuarios. En los demás casos, las
              partes se someten a los Juzgados y Tribunales de España que
              resulten competentes.
            </li>
            <li>
              El Titular puede modificar estos Términos; la fecha de última
              actualización reflejará el cambio.
            </li>
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
            cuando proceda, en el consentimiento del Usuario o en el
            cumplimiento de obligaciones legales:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-5">
            <li>Gestión de registros, perfiles y cuenta de usuario.</li>
            <li>
              Identidad aportada (teléfono y DNI/NIE) para pagar viajes y
              prevenir fraude.
            </li>
            <li>
              Tramitación de reservas, portes, plazas, chat interno y pasarela
              de pagos.
            </li>
            <li>
              Gestión de disputas, rechazos en recogida, reseñas y
              notificaciones.
            </li>
            <li>
              Atención a requerimientos legales de autoridades competentes.
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
              Los datos de reservas, chat, fotos de carga y transacciones se
              conservan el tiempo necesario para prestar el servicio, resolver
              disputas y cumplir obligaciones legales.
            </li>
          </ul>

          <h3 className="mb-2 font-semibold text-zinc-900">
            4. Información a la Administración Tributaria (DAC7)
          </h3>
          <p className="mb-4">
            En cumplimiento de la Directiva (UE) 2021/514 (DAC7) y el Real
            Decreto 1178/2023, la Plataforma informará anualmente a la
            Administración Tributaria correspondiente de los datos de
            identificación y de las prestaciones económicas percibidas por
            aquellos usuarios/conductores que superen los límites legales
            previstos (30 operaciones o 2.000 € de retribución anual).
          </p>

          <h3 id="cookies" className="mb-2 scroll-mt-20 font-semibold text-zinc-900">
            5. Cookies
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
            6. Baja de cuenta y conservación de datos
          </h3>
          <p className="mb-4">
            Puede solicitar la eliminación de su cuenta desde{" "}
            <strong>Mi cuenta → Eliminar mi cuenta</strong>. Si no tiene
            reservas, disputas, viajes o anuncios activos ni saldo pendiente,
            se procederá al borrado. Si tiene historial de viajes, se
            anonimizará su perfil y se bloqueará el acceso, conservando los
            datos mínimos necesarios para el historial de transacciones,
            facturación y resolución de disputas durante los plazos legalmente
            exigibles (habitualmente hasta 6 años en materia fiscal y
            contractual, según la normativa aplicable).
          </p>

          <h3 className="mb-2 font-semibold text-zinc-900">
            7. Derechos del usuario
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
