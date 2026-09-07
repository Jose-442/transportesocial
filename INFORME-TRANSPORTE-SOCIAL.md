INFORME DESCRIPTIVO TÉCNICO
TRANSPORTE SOCIAL
Fecha del informe: 28 de junio de 2026
Titular y promotor del proyecto:
D. Jose Ezequiel Martín
Correo electrónico: jemartarrero@gmail.com
NIF: [completar]
Domicilio: [completar]
URL de producción: https://transportesocial.vercel.app
Repositorio de código: proyecto «transporte-social» (código fuente versionado con Git, desplegado en Vercel).
Base de datos y autenticación: Supabase (proyecto «transporte-social», región UE).
AVISO LEGAL: Este documento es un informe descriptivo técnico redactado con asistencia de inteligencia artificial. No sustituye un informe pericial judicial ni asesoramiento legal. Para procedimientos formales, conviene que un abogado y, si procede, un perito informático independiente lo revisen o ratifiquen.
1. OBJETO DEL INFORME
El presente documento describe, con detalle técnico y funcional, la aplicación web TRANSPORTE SOCIAL, desarrollada por el titular indicado con asistencia de herramientas de inteligencia artificial (asistente de programación integrado en el entorno Cursor), sin contratar desarrolladores externos para este producto y sin coste de desarrollo profesional.
El titular del proyecto nunca había utilizado un ordenador antes; el conocimiento técnico necesario fue aplicado mediante instrucciones en lenguaje natural al asistente de IA, revisión de resultados y pruebas en navegador.
2. NATURALEZA Y FINALIDAD DE LA APLICACIÓN
TRANSPORTE SOCIAL es una plataforma web de crowdshipping / transporte colaborativo orientada al mercado español. Permite:
- Que conductores o transportistas publiquen viajes con origen, destino, fecha, espacio disponible y precio.
- Que personas que necesitan viajar y/o enviar un bulto publiquen solicitudes (viajes o anuncios de bulto).
- Que se reserven plazas o envíos, se paguen mediante pasarela bancaria, se gestione el dinero en depósito (escrow) hasta la entrega, y se resuelvan disputas y reseñas.
- Que la plataforma cobre suscripción mensual, aportación por publicación y comisión por viaje pagado (22 % sobre el precio publicado).
La aplicación está operativa en producción en la URL indicada, con usuarios registrados, viajes publicados, reservas y pagos probados satisfactoriamente por el titular.
2.1. FUNCIONALIDADES TÉCNICAS Y COMPARATIVA ORIENTATIVA FRENTE A BLABLAMOTO
Ofertas de precio por parte del conductor/transportista
- Los conductores y transportistas pueden consultar viajes y propuestas publicadas por personas que necesitan viajar como acompañante y/o transportar un bulto.
- Pueden formular una oferta económica y enviarla a la persona solicitante.
- La persona destinataria recibe una notificación en tiempo real y puede aceptar o rechazar la oferta; si acepta, se inicia el flujo de reserva y pago.
Cobertura geográfica: municipios y provincias
- Los anuncios pueden crearse con origen y destino en cualquier municipio de España, no limitados a un catálogo de ciudades como en BlaBlaMoto.
- El motor de búsqueda utiliza catálogo nacional de municipios con autocompletado y filtrado por provincia y proximidad.
- El buscador agrupa y muestra los viajes de cada provincia de salida y de cada provincia de destino indicadas, con cobertura más amplia y granular que BlaBlaMoto.
Automatización integral de pagos, reembolsos y liquidaciones
Según manifiesta el titular, en BlaBlaMoto muchas operaciones económicas debían gestionarse manualmente. En TRANSPORTE SOCIAL, el ciclo financiero está automatizado mediante integración con Stripe, webhooks y tareas programadas (cron):
- Cobro al cliente: pago automático en el momento de la reserva.
- Retención en escrow: el importe queda retenido hasta que se cumplen las condiciones del viaje.
- Reembolso por cancelación: si la reserva se cancela o expira (por ejemplo, conductor no responde en 8 horas), el sistema ejecuta el reembolso automático al cliente.
- Reembolso en disputas resueltas a favor del cliente: la resolución desde el panel de administración dispara el reembolso automático del pago retenido.
- Pago al conductor: tras la entrega y transcurrido el plazo de reclamación sin disputa, el sistema libera automáticamente el pago al conductor, incluyendo transferencia a cuenta Stripe Connect cuando procede.
- Disputas resueltas a favor del conductor: liberación automática del importe retenido.
- Suscripciones y aportaciones por publicación: cobro y renovación gestionados por Stripe con sincronización automática al perfil del usuario.
En conjunto: pagos, devoluciones por cancelación, devoluciones en disputas y liquidaciones a conductores se procesan sin intervención manual del propietario de la plataforma, a diferencia de lo que el titular experimentó en BlaBlaMoto.
Chat con edición y borrado de mensajes
- Chat privado por reserva con mensajería en tiempo real.
- Permite editar y eliminar el último mensaje enviado, funcionalidad que no tiene BlaBlaMoto.
Multiplataforma: web en Apple, Android y PC
- TRANSPORTE SOCIAL es una aplicación web (PWA) usable en iPhone/iPad, Android y ordenador, instalable en pantalla de inicio del móvil.
- BlaBlaMoto es solo aplicación móvil nativa; TRANSPORTE SOCIAL funciona en todos los dispositivos con un solo producto web.
Suscripción: tres publicaciones gratuitas y control de la cuarta
- Con suscripción activa: 3 publicaciones gratuitas.
- El sistema memoriza el contador de publicaciones; a partir de la cuarta, exige el cobro automático de la aportación (0,90 €) antes de publicar.
Panel de administración con control del propietario
- Panel en /admin: resumen, disputas, reservas, usuarios, anuncios, pagos.
- El propietario puede eliminar usuarios, viajes y bultos desde el panel.
Módulo de disputas
- Sistema de apertura, seguimiento y resolución de disputas con impacto automático en el escrow. BlaBlaMoto no dispone de este módulo, según manifiesta el titular.
Emails y señalización de plazas libres
- Emails de bienvenida y avisos automáticos.
- Puntos verdes en el listado de viajes indican plazas de acompañante libres en cada vehículo (puntos rojos = ocupadas).
Conclusión comparativa
TRANSPORTE SOCIAL integra viajes, bultos, ofertas, pagos automatizados, escrow, reembolsos, disputas, chat editable, administración, emails, búsqueda por municipio/provincia y acceso multiplataforma. El titular manifiesta que es sustancialmente más completa que BlaBlaMoto.
3. PLAZO REAL DE DESARROLLO
Inicio del proyecto (trabajo del titular): 9 de junio de 2026
Primer registro formal en control de versiones (Git): 16 de junio de 2026
Estado operativo en producción: antes del 28 de junio de 2026
DURACIÓN TOTAL DEL PROYECTO: 19 DÍAS (del 9 de junio de 2026 al 28 de junio de 2026).
4. COSTE ECONÓMICO DEL DESARROLLO
Honorarios de desarrollo de software contratados: 0 EUROS
Coste total de desarrollo profesional de la aplicación: 0 EUROS
El titular no ha pagado a ningún programador ni empresa de desarrollo por la creación de TRANSPORTE SOCIAL. El coste de desarrollo ha sido de 0 euros.
Nota: los gastos de servicios en funcionamiento (hosting Vercel, Supabase, comisiones Stripe por transacciones, etc.) son costes de operación, no de creación del software.
5. STACK TECNOLÓGICO
Next.js 16, React 19, TypeScript, Tailwind CSS 4, Supabase (PostgreSQL, Auth, Realtime, RLS), Stripe (Checkout, suscripciones, Connect, webhooks, reembolsos), Resend, Vercel, cron diario en /api/cron/reservas. Más de 21 migraciones SQL en base de datos.
6. DECLARACIÓN DEL TITULAR
Yo, Jose Ezequiel Martín, declaro bajo mi responsabilidad que:
1. Soy el promotor y responsable del proyecto TRANSPORTE SOCIAL.
2. La aplicación está desplegada y operativa en https://transportesocial.vercel.app.
3. El desarrollo de este producto no ha supuesto contratación de programadores. El coste ha sido de 0 EUROS.
4. Nunca había utilizado un ordenador antes de este proyecto. El trabajo se realizó en un plazo de 19 DÍAS (del 9 al 28 de junio de 2026), mediante instrucciones en lenguaje natural a un asistente de inteligencia artificial y pruebas en navegador.
5. He comprobado personalmente el funcionamiento de publicación de viajes, reservas y pagos en producción.
6. Este documento se expide para acreditar la existencia, alcance técnico, plazo de 19 días y coste de 0 euros de la aplicación.
En [localidad], a 28 de junio de 2026
Fdo.: _________________________________
Jose Ezequiel Martín
