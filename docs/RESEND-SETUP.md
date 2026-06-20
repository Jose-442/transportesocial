# Configurar Resend — correos de bienvenida

Guía paso a paso para que lleguen los emails de **Transporte Social**.

---

## Qué emails envía la app

| Cuándo | Email |
|--------|--------|
| **Registro** (crear cuenta) | Bienvenida |
| **Primera suscripción** (pagar 0,95 €/mes) | Bienvenida como suscriptor |
| **Nueva oferta** en un bulto | Aviso al dueño del bulto |

Sin Resend configurado, la app funciona pero **no manda correos**.

---

## Paso 1 — Crear cuenta en Resend

1. Abre [https://resend.com](https://resend.com)
2. **Sign up** (registro gratis)
3. Confirma tu correo si te lo piden

---

## Paso 2 — Crear la API Key

1. En Resend → menú **API Keys**
2. **Create API Key**
3. Nombre: `transporte-social`
4. Permiso: **Sending access** (envío)
5. Copia la clave (empieza por `re_...`). **Solo se muestra una vez.**

---

## Paso 3 — Modo prueba (rápido, hoy mismo)

Con la cuenta nueva, Resend permite enviar **desde**:

`onboarding@resend.dev`

**Limitación:** en modo prueba solo llega al **correo con el que te registraste en Resend**.

Sirve para comprobar que funciona. Para enviar a cualquier usuario hay que verificar un dominio (paso 5).

---

## Paso 4 — Variables en Vercel

1. Vercel → proyecto **`transportesocial`** → **Environment Variables**
2. Añade:

| Key | Value |
|-----|--------|
| `RESEND_API_KEY` | La clave `re_...` que copiaste |
| `RESEND_FROM_EMAIL` | `Transporte Social <onboarding@resend.dev>` |

3. Environments: **Production** y **Preview**
4. **Save**
5. **Deployments** → **Redeploy** (para que coja las variables)

También pon las mismas dos líneas en tu **`.env.local`** en el PC si pruebas en local.

---

## Paso 5 — Producción real (dominio propio)

Para que el correo llegue a **cualquier usuario** (no solo a tu email de Resend):

1. Resend → **Domains** → **Add Domain**
2. Dominio: `transporte.moteria.es` (cuando lo tengas apuntando a Vercel)
3. Resend te da registros **DNS** (SPF, DKIM…)
4. En **DonDominio** (o donde gestiones el dominio), añade esos registros
5. Cuando Resend marque el dominio como **Verified**, cambia en Vercel:

```
RESEND_FROM_EMAIL=Transporte Social <noreply@transporte.moteria.es>
```

6. Redeploy otra vez

---

## Paso 6 — Probar

### Registro
1. Registra un usuario nuevo con un email al que puedas acceder
2. Debe llegar: **«Bienvenido a Transporte Social»**

### Suscripción
1. Suscríbete con Stripe (modo test)
2. Debe llegar: **«¡Bienvenido a Transporte Social! Suscripción activa»**

Si no llega:
- Revisa **spam**
- Vercel → **Logs** → busca `[welcome-email]` o `[subscription-welcome-email]`
- Comprueba que `RESEND_API_KEY` está en Vercel y hubo redeploy

---

## Resumen en una frase

> Cuenta en Resend → API Key → pegar en Vercel (`RESEND_API_KEY` + `RESEND_FROM_EMAIL`) → Redeploy → probar registro o suscripción.
