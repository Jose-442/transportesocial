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

Opcional: correo de bienvenida vía [Resend](https://resend.com). Añade `RESEND_API_KEY` y `RESEND_FROM_EMAIL` en `.env.local`. Sin esas variables, el registro funciona igual pero no se envía el email.

El enlace `/auth/callback` sigue usándose para otros flujos de auth (p. ej. recuperación de contraseña).

En **Authentication → Providers**, deja **Email** activado.

### Realtime

En **Database → Replication**, confirma que `notificaciones` está en la publicación `supabase_realtime` (la migración lo añade).

## 2. Variables de entorno

Crea `.env.local` (local) con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Las encuentras en **Project Settings → API**.

> No subas `.env.local` a git. La `anon key` es pública por diseño; la `service_role` **nunca** en el cliente.

## 3. Despliegue en Vercel (cuando quieras)

1. Sube el repo a GitHub (o conecta la carpeta con `vercel`).
2. En Vercel → proyecto del equipo `transporte-social` → **Import**.
3. Framework: **Next.js** (auto-detectado).
4. Añade las mismas variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy.

Después del primer deploy, actualiza en Supabase las **Redirect URLs** con la URL de Vercel (`*.vercel.app`) y más adelante `https://transporte.moteria.es`.

### DNS DonDominio (fase posterior)

Cuando la app esté estable en Vercel:

- CNAME `transporte` → `cname.vercel-dns.com` (o el que indique Vercel en **Domains**)
- No tocar `mercado.moteria.es` (WordPress)

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
