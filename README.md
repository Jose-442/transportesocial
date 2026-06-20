# Transporte Social

App de crowdshipping (portes / gastos compartidos) para España. Dominio previsto: `transporte.moteria.es`.

**Stack:** Next.js (App Router), Tailwind CSS, Supabase (auth + base de datos). Stripe Connect en fase posterior.

## Requisitos

- Node.js 20+
- Cuenta Supabase (proyecto `transporte-social`, región EU)
- Cuenta Vercel (equipo `transporte-social`, plan Hobby)

## Arranque en local

```bash
cd transporte-social
npm install
cp .env.local.example .env.local
# Edita .env.local con tus claves de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Comprobaciones antes de dar un cambio por bueno

Tras modificar código (sobre todo con el asistente de IA), ejecuta:

```bash
npm run check
```

Eso lanza, en orden: **lint** → **tests** → **build**. Si algo falla, no des por cerrado el cambio hasta corregirlo.

Copia de seguridad local con Git (antes de cambios grandes):

```bash
git add .
git commit -m "descripción breve del estado"
```

## 1. Migración en Supabase

**Guía completa (001 → 020):** ver [`docs/SUPABASE-CHECKLIST.md`](docs/SUPABASE-CHECKLIST.md) — diagnóstico paso a paso y queries de verificación.

Resumen mínimo (solo proyecto nuevo):

1. Entra en [Supabase Dashboard](https://supabase.com/dashboard) → proyecto **transporte-social**.
2. Ve a **SQL Editor** → **New query**.
3. Copia y pega **todo** el contenido de:

   `supabase/migrations/001_init.sql`

4. Pulsa **Run**.

Esto crea:

- Tablas: `profiles`, `rutas_conductores`, `anuncios_bultos`, `ofertas_precio`, `reservas`, `transacciones`, `notificaciones`
- RLS (seguridad por fila)
- Trigger de perfil al registrarse
- Notificación automática al recibir una propuesta de precio
- Realtime en `notificaciones`
- Bucket `bultos-fotos` para imágenes

### Auth en Supabase

En **Authentication → URL Configuration**:

| Campo | Valor local | Valor producción (después) |
|-------|-------------|----------------------------|
| Site URL | `http://localhost:3000` | `https://transporte.moteria.es` |
| Redirect URLs | `http://localhost:3000/auth/callback**` | `https://transporte.moteria.es/auth/callback**` |

En **Authentication → Providers → Email**, desactiva **«Confirmar el correo electrónico»**. Tras registrarse, el usuario entra directamente (sin correo de confirmación).

Correos (bienvenida, suscripción, ofertas) vía [Resend](https://resend.com). Guía paso a paso: [`docs/RESEND-SETUP.md`](docs/RESEND-SETUP.md). Variables: `RESEND_API_KEY` y `RESEND_FROM_EMAIL` en `.env.local` y Vercel.

El enlace `/auth/callback` sigue usándose para otros flujos de auth (p. ej. recuperación de contraseña).

En **Authentication → Providers**, deja **Email** activado.

### Realtime

En **Database → Replication**, confirma que `notificaciones` está en la publicación `supabase_realtime` (la migración lo añade).

## 2. Variables de entorno

Guía completa: [`docs/DEPLOY-VERCEL.md`](docs/DEPLOY-VERCEL.md)

```bash
cp .env.local.example .env.local
```

Mínimo local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

En **producción** añade también `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` y las claves Stripe (ver guía de deploy).

## 3. Despliegue en Vercel

Ver [`docs/DEPLOY-VERCEL.md`](docs/DEPLOY-VERCEL.md) (variables, cron, webhook Stripe, Auth Supabase).

## Estructura del proyecto

```
src/
├── app/              # Rutas App Router
├── components/       # UI mobile-first (área táctil ≥ 44px)
├── actions/          # Server Actions
├── lib/
│   ├── supabase/     # Cliente browser / server / middleware
│   ├── constants.ts  # Comisiones y tarifas
│   └── pricing.ts    # Cálculo 22 %, trial, etc.
└── types/
supabase/migrations/  # SQL para pegar en Supabase
```

## Fase 1 (implementado)

- Landing y navegación móvil
- Registro / login (Supabase Auth)
- Publicar ruta (precio neto → precio con 22 %)
- Publicar bulto (foto opcional, sin precio)
- Listados y detalle
- Propuestas de precio en bultos
- Notificaciones en UI + sonido (Realtime)
- Modelo de datos para escrow / Stripe (sin cobro aún)

## Fase 2 (pendiente)

- Stripe Connect y cobro real
- Emails transaccionales y push
- DNS `transporte.moteria.es`
- Liberación automática de escrow X h tras llegada

## Modelo de negocio (referencia)

| Periodo | Suscripción | Por publicación/propuesta | Por viaje pagado |
|---------|-------------|---------------------------|------------------|
| 3 meses trial | 0 € | 0 € | 22 % |
| Después | 0,95 €/mes | 0,95 € | 22 % |

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build producción
npm run start    # servir build
npm run lint     # ESLint
```
