# Despliegue en Vercel — transporte-social

Guía para dejar la app en producción (Vercel + Supabase + Stripe).

**Antes:** termina el checklist de base de datos en [`SUPABASE-CHECKLIST.md`](SUPABASE-CHECKLIST.md).

---

## 1. Variables de entorno

Copia `.env.local.example` → `.env.local` (local) y añade **las mismas** en Vercel → **Settings → Environment Variables**.

| Variable | Obligatoria | Dónde obtenerla |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sí* | Misma pantalla (clave anon/public) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Sí en prod** | API → `service_role` (secreta) |
| `CRON_SECRET` | **Sí en prod** | Inventa una cadena larga (32+ caracteres) |
| `STRIPE_SECRET_KEY` | Sí (cobros) | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Sí (cobros) | Misma pantalla |
| `STRIPE_WEBHOOK_SECRET` | Sí (cobros) | Stripe → Webhooks → signing secret |
| `RESEND_API_KEY` | **Sí (emails)** | [Resend](https://resend.com) → API Keys → `re_...` |
| `RESEND_FROM_EMAIL` | **Sí (emails)** | `Transporte Social <onboarding@resend.dev>` (prueba) o `noreply@tu-dominio` (prod) |

\* También vale `NEXT_PUBLIC_SUPABASE_ANON_KEY` (alias antiguo; el código acepta ambos).

### Qué pasa si falta algo

| Falta | Efecto |
|-------|--------|
| `SUPABASE_SERVICE_ROLE_KEY` | Notificaciones de chat, webhook Stripe, cron, disputas y borrado de cuenta degradan o fallan |
| `CRON_SECRET` | `/api/cron/reservas` responde 401; no expiran aprobaciones ni se libera escrow automático |
| Stripe | No hay suscripción, aportación ni pago de viajes |
| Resend | Sin emails de bienvenida, suscripción ni aviso de ofertas |

Guía detallada: [`docs/RESEND-SETUP.md`](RESEND-SETUP.md).

---

## 2. Vercel — pasos

1. Conecta el repo en [Vercel](https://vercel.com) (equipo/proyecto `transporte-social`).
2. Framework: **Next.js** (auto).
3. Añade todas las variables de la tabla anterior (Production + Preview si quieres).
4. **Deploy**.

Dominio previsto: `https://transporte.moteria.es` (configurar en Vercel → Domains cuando toque).

---

## 3. Cron automático

El archivo `vercel.json` programa:

- **Ruta:** `/api/cron/reservas`
- **Frecuencia:** una vez al día a las 09:00 UTC (`0 9 * * *`) — límite del plan **Hobby** de Vercel (1 cron/día). Para cada 15 min hace falta Pro o un cron externo que llame a la misma ruta con `CRON_SECRET`.

Vercel envía la petición con cabecera `Authorization: Bearer <CRON_SECRET>`.

**Comprueba** que `CRON_SECRET` en Vercel coincide con el valor que definiste.

Tareas del cron:
- Expirar reservas en `pendiente_aprobacion`
- Auto-marcar entregadas tras plazo
- Liberar pago al conductor (escrow)
- Procesar reseñas expiradas

---

## 4. Stripe — webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. **URL:** `https://TU-DOMINIO/api/stripe/webhook`
   - Ejemplo prod: `https://transporte.moteria.es/api/stripe/webhook`
3. Eventos mínimos (según lo que uses):
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET` en Vercel.

Modo test vs live: las claves `sk_test_` / `pk_test_` deben ir con webhook de test; en producción real usa live.

---

## 5. Supabase — Auth (después del deploy)

**Authentication → URL Configuration:**

| Campo | Producción |
|-------|------------|
| Site URL | `https://transporte.moteria.es` (o tu URL Vercel temporal) |
| Redirect URLs | `https://transporte.moteria.es/auth/callback**` |

Añade también `http://localhost:3000/auth/callback**` para desarrollo local.

**Providers → Email:** desactiva «Confirmar el correo electrónico» si quieres entrada directa tras registro.

---

## 6. Supabase — Realtime

**Database → Replication:** confirma en `supabase_realtime`:

- `notificaciones`
- `chat_mensajes`

(Las migraciones 001 y 007 lo añaden; ver [`SUPABASE-CHECKLIST.md`](SUPABASE-CHECKLIST.md) paso 0F.)

---

## 7. Comprobación post-deploy

1. Abre la URL de producción → `/bultos` y `/rutas` (listados sin login).
2. Registro + login.
3. Suscripción / aportación (Stripe test).
4. Publicar bulto o ruta.
5. Propuesta de precio + aceptar + pago.
6. Chat en reserva confirmada.
7. En Vercel → **Logs**, revisa que el cron no devuelva 401/503.

Local antes de subir:

```bash
npm run check
```

---

## 8. DNS (DonDominio)

Cuando la app esté estable:

- CNAME `transporte` → el que indique Vercel en **Domains**
- No tocar `mercado.moteria.es` (WordPress)
