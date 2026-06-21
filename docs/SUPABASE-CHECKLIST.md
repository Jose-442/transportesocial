# Checklist Supabase — transporte-social

Guía paso a paso para comprobar que la base de datos de **producción** tiene todo lo que el código necesita.

**Proyecto:** Supabase → **transporte-social** → **SQL Editor** → **New query**

**Importante:** La tabla de perfiles se llama **`profiles`** (en inglés), no `perfiles`.

**Estado conocido (última sesión):** aplicada **019**, chat creado a mano + **020**. No está garantizado que **002–018** estén todas.

---

## Cómo usar esta guía

1. Ejecuta **una query cada vez** (Supabase solo muestra bien el último resultado si pegas varias seguidas).
2. Copia el bloque SQL, pulsa **Run**, mira el resultado.
3. Compara con la columna **«Esperado»** de cada paso.
4. Si falta algo → abre el archivo de migración indicado, pégalo entero en SQL Editor y ejecuta.
5. Vuelve a ejecutar la query de verificación hasta que cuadre.
6. Pasa a la siguiente migración o al diagnóstico global.

**Orden recomendado:** diagnóstico global (abajo) → migraciones que falten, **en orden numérico** (001 → 020).

---

## Paso 0 — Diagnóstico global (ejecutar primero)

Copia y ejecuta **cada bloque por separado**.

### 0A — Tablas críticas

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles',
    'rutas_conductores',
    'anuncios_bultos',
    'ofertas_precio',
    'reservas',
    'transacciones',
    'notificaciones',
    'chat_canales',
    'chat_mensajes',
    'disputas',
    'resenas',
    'ofertas_capacidad'
  )
ORDER BY table_name;
```

**Esperado:** 12 filas (todas las tablas listadas).

| Si falta… | Migración |
|-----------|-----------|
| `chat_canales`, `chat_mensajes`, `disputas` | `007_reservas_chat_disputas.sql` (+ `008_grants_chat_disputas.sql`) |
| `resenas` | `009_resenas.sql` (+ `010_grants_resenas.sql`) |
| `ofertas_capacidad` | `011_ofertas_capacidad.sql` (+ `012_grants_ofertas_capacidad.sql`) |
| Cualquier tabla base | `001_init.sql` (solo si el proyecto está vacío) |

---

### 0B — Columnas clave en `profiles`

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN (
    'avatar_url',
    'stripe_subscription_id',
    'sobre_ti',
    'vehiculo_marca',
    'vehiculo_modelo',
    'vehiculo_anio',
    'distintivo_ambiental',
    'rating_promedio',
    'rating_cantidad',
    'aceptacion_automatica',
    'saldo_acumulado'
  )
ORDER BY column_name;
```

**Esperado:** 11 filas.

| Columna | Migración |
|---------|-----------|
| `avatar_url` | 002 |
| `stripe_subscription_id` | 005 |
| `sobre_ti` | 017 |
| `vehiculo_*`, `distintivo_ambiental` | 019 |
| `rating_*` | 009 |
| `aceptacion_automatica`, `saldo_acumulado` | 007 |

---

### 0C — Columnas en `anuncios_bultos` y `ofertas_precio`

```sql
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (
    (table_name = 'anuncios_bultos' AND column_name = 'tipo_solicitud')
    OR (table_name = 'ofertas_precio' AND column_name = 'desglose')
  )
ORDER BY table_name, column_name;
```

**Esperado:** 2 filas (`tipo_solicitud`, `desglose`). Migración: **014**.

---

### 0D — Columnas chat (editar / borrar)

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'chat_mensajes'
  AND column_name IN ('editado_en', 'eliminado')
ORDER BY column_name;
```

**Esperado:** 2 filas (`editado_en` nullable, `eliminado` default `false`). Migración: **020**.

---

### 0E — Políticas `chat_mensajes`

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'chat_mensajes'
ORDER BY cmd, policyname;
```

**Esperado:** al menos 3 filas — `SELECT`, `INSERT`, `UPDATE` (`Chat mensajes edición último propio`).

| Si falta UPDATE | Migración **020** |
| Si falta INSERT/SELECT | Migración **007** (o bloque chat del paso 4b de la sesión manual) |

---

### 0F — Realtime (notificaciones y chat)

```sql
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('notificaciones', 'chat_mensajes')
ORDER BY tablename;
```

**Esperado:** 2 filas.

| Tabla | Migración |
|-------|-----------|
| `notificaciones` | 001 |
| `chat_mensajes` | 007 |

**Si falla** `ALTER PUBLICATION … already member` al aplicar 007 → la tabla ya está; ignora el error.

---

### 0G — Lectura pública anon (listados sin login)

```sql
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('anuncios_bultos', 'rutas_conductores', 'profiles', 'resenas')
  AND 'anon' = ANY(roles)
ORDER BY tablename, policyname;
```

**Esperado:** al menos políticas para bultos/rutas activos (**016**), perfiles (**018**), reseñas visibles (**018**).

---

## Lista de migraciones 001 → 020

Ejecutar **en orden**. Si una ya está aplicada, la verificación dirá OK y puedes saltarla.

| # | Archivo | Qué aporta (1 línea) |
|---|---------|----------------------|
| 001 | `001_init.sql` | Tablas base, RLS inicial, trigger perfil, notificaciones, storage bultos, Realtime notificaciones |
| 002 | `002_profile_avatar.sql` | `avatar_url` + bucket storage `avatars` |
| 003 | `003_transacciones_update_policy.sql` | Política UPDATE transacciones (crédito publicación) |
| 004 | `004_profiles_insert_policy.sql` | Política INSERT perfil propio |
| 005 | `005_stripe_subscription_id.sql` | Columna `stripe_subscription_id` |
| 006 | `006_table_grants.sql` | **GRANTs** esenciales (sin esto: «permission denied») |
| 007 | `007_reservas_chat_disputas.sql` | Estados reserva, chat, disputas, saldo conductor, Realtime chat |
| 008 | `008_grants_chat_disputas.sql` | GRANTs chat y disputas |
| 009 | `009_resenas.sql` | Tabla `resenas`, ratings en perfil, plazo reseña |
| 010 | `010_grants_resenas.sql` | GRANTs reseñas |
| 011 | `011_ofertas_capacidad.sql` | Tabla `ofertas_capacidad`, tipo reserva capacidad_extra |
| 012 | `012_grants_ofertas_capacidad.sql` | GRANTs ofertas capacidad |
| 013 | `013_ofertas_capacidad_ruta_activa.sql` | Política INSERT plazas al publicar ruta activa |
| 014 | `014_tipo_solicitud.sql` | Enum `tipo_solicitud` + `desglose` JSONB en ofertas |
| 015 | `015_rutas_delete_rollback.sql` | DELETE rutas activas (rollback si falla publicación) |
| 016 | `016_busqueda_publica_anon.sql` | Listados `/bultos` y `/rutas` visibles sin sesión |
| 017 | `017_profile_sobre_ti.sql` | Columna `sobre_ti` en perfiles |
| 018 | `018_perfiles_publicos_anon.sql` | Perfiles y reseñas visibles para anon |
| 019 | `019_vehiculo_conductor.sql` | Vehículo conductor (marca, modelo, año, distintivo) |
| 020 | `020_chat_editar_borrar.sql` | `editado_en`, `eliminado`, GRANT UPDATE, RLS editar último mensaje |

Ruta local de cada archivo: `supabase/migrations/NNN_nombre.sql`

---

## Verificación por migración

### 001 — Inicial

```sql
SELECT COUNT(*) AS tablas_base
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'rutas_conductores', 'anuncios_bultos',
    'ofertas_precio', 'reservas', 'notificaciones'
  );
```

**Esperado:** `tablas_base = 6`

**Aplicar:** `supabase/migrations/001_init.sql` (solo en proyecto nuevo; si ya hay datos, no repetir CREATE TABLE).

---

### 002 — Avatar

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'avatar_url';
```

**Esperado:** 1 fila.

```sql
SELECT id FROM storage.buckets WHERE id = 'avatars';
```

**Esperado:** 1 fila.

---

### 003 — Transacciones UPDATE

```sql
SELECT policyname FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'transacciones'
  AND cmd = 'UPDATE';
```

**Esperado:** al menos 1 política (p. ej. `Usuario actualiza sus transacciones`).

---

### 004 — Perfil INSERT

```sql
SELECT policyname FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND cmd = 'INSERT';
```

**Esperado:** al menos 1 política.

---

### 005 — Stripe subscription id

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'stripe_subscription_id';
```

**Esperado:** 1 fila.

---

### 006 — GRANTs base

```sql
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'authenticated'
  AND table_name IN ('profiles', 'anuncios_bultos', 'ofertas_precio', 'notificaciones')
ORDER BY table_name, privilege_type;
```

**Esperado:** varias filas con SELECT, INSERT, UPDATE para `authenticated`.

**Si vacío:** ejecutar `006_table_grants.sql`.

---

### 007 — Chat, disputas, reservas ampliadas

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('chat_canales', 'chat_mensajes', 'disputas')
ORDER BY table_name;
```

**Esperado:** 3 filas.

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('aceptacion_automatica', 'saldo_acumulado');
```

**Esperado:** 2 filas.

---

### 008 — GRANTs chat

```sql
SELECT privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'authenticated'
  AND table_name = 'chat_mensajes'
ORDER BY privilege_type;
```

**Esperado:** SELECT, INSERT (y UPDATE si ya aplicaste 020).

---

### 009 — Reseñas

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'resenas';
```

**Esperado:** 1 fila.

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN ('rating_promedio', 'rating_cantidad');
```

**Esperado:** 2 filas.

---

### 010 — GRANTs reseñas

```sql
SELECT privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'authenticated'
  AND table_name = 'resenas';
```

**Esperado:** al menos SELECT, INSERT, UPDATE.

---

### 011 — Ofertas capacidad

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'ofertas_capacidad';
```

**Esperado:** 1 fila.

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'reservas'
  AND column_name IN ('oferta_capacidad_id', 'cantidad');
```

**Esperado:** 2 filas.

---

### 012 — GRANTs capacidad

```sql
SELECT privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'authenticated'
  AND table_name = 'ofertas_capacidad';
```

**Esperado:** SELECT, INSERT, UPDATE.

---

### 013 — Plazas al publicar ruta

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'ofertas_capacidad'
  AND cmd = 'INSERT';
```

**Esperado:** al menos 2 políticas INSERT (una de 011 y `Conductor crea plazas al publicar ruta activa` de 013).

---

### 014 — Tipo solicitud y desglose

```sql
SELECT column_name, udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'anuncios_bultos'
  AND column_name = 'tipo_solicitud';
```

**Esperado:** 1 fila, `udt_name = tipo_solicitud`.

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ofertas_precio'
  AND column_name = 'desglose';
```

**Esperado:** 1 fila.

---

### 015 — Borrar rutas activas

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'rutas_conductores'
  AND cmd = 'DELETE';
```

**Esperado:** 1 política (`Conductor borra sus rutas activas`).

```sql
SELECT privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'authenticated'
  AND table_name = 'rutas_conductores'
  AND privilege_type = 'DELETE';
```

**Esperado:** 1 fila.

---

### 016 — Búsqueda pública anon

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'anuncios_bultos'
  AND policyname ILIKE '%anon%';
```

**Esperado:** `Bultos activos visibles para anon`.

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'rutas_conductores'
  AND policyname ILIKE '%anon%';
```

**Esperado:** `Rutas activas visibles para anon`.

---

### 017 — Sobre ti

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'sobre_ti';
```

**Esperado:** 1 fila.

---

### 018 — Perfiles públicos anon

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'profiles'
  AND policyname = 'Perfiles visibles para anon';
```

**Esperado:** 1 fila.

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'resenas'
  AND policyname = 'Reseñas públicas visibles para anon';
```

**Esperado:** 1 fila.

---

### 019 — Vehículo conductor

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN (
    'vehiculo_marca',
    'vehiculo_modelo',
    'vehiculo_anio',
    'distintivo_ambiental'
  )
ORDER BY column_name;
```

**Esperado:** 4 filas. *(Ya aplicada en tu sesión.)*

---

### 020 — Chat editar / borrar

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'chat_mensajes'
  AND column_name IN ('editado_en', 'eliminado')
ORDER BY column_name;
```

**Esperado:** 2 filas.

```sql
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'chat_mensajes'
  AND policyname = 'Chat mensajes edición último propio';
```

**Esperado:** 1 fila.

---

## Errores frecuentes al aplicar migraciones

| Error | Qué hacer |
|-------|-----------|
| `relation "X" already exists` | La migración ya está parcialmente aplicada; pasa a la **verificación** de esa migración |
| `policy "X" already exists` | Usa `DROP POLICY IF EXISTS` antes del CREATE, o salta si la verificación OK |
| `type "X" already exists` | El enum/tipo ya existe; sigue con el resto del archivo o salta |
| `already member of publication` | Realtime ya configurado; ignora |
| `permission denied for table` | Falta **006** o grants de 008/010/012/020 |

---

## Cuando todo esté OK

Ejecuta este resumen final:

```sql
-- Tablas (debe devolver 12)
SELECT COUNT(*) AS n_tablas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'rutas_conductores', 'anuncios_bultos', 'ofertas_precio',
    'reservas', 'transacciones', 'notificaciones', 'chat_canales',
    'chat_mensajes', 'disputas', 'resenas', 'ofertas_capacidad'
  );

-- Realtime (debe devolver 2)
SELECT COUNT(*) AS n_realtime
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('notificaciones', 'chat_mensajes');
```

**Esperado:** `n_tablas = 12`, `n_realtime = 2`.

---

## Prueba rápida en la app (después del checklist)

Con `npm run dev` y la BD al día:

1. **Sin login:** `/bultos` y `/rutas` muestran listados (016).
2. **Cuenta:** sección vehículo y sobre ti (019, 017).
3. **Bulto con pasajeros:** propuesta con plazas ofrecidas y desglose (014).
4. **Reserva confirmada:** chat enviar / editar / borrar (007, 020).
5. **Perfil público** `/perfil/[id]` sin sesión (018).

---

Cuando todo esté OK, pasa a [`DEPLOY-VERCEL.md`](DEPLOY-VERCEL.md) (variables y Vercel).

---

## Resumen Fase 1 completada (checklist mínimo)

Si has pasado estos pasos con éxito, la BD está alineada con el código:

| Paso | Esperado |
|------|----------|
| 0A | 12 tablas |
| 0B | 11 columnas en `profiles` |
| 0C | 2 columnas (`tipo_solicitud`, `desglose`) |
| 0D | 2 columnas chat (`editado_en`, `eliminado`) |
| 0E | 3 políticas chat (SELECT, INSERT, UPDATE) |
| 0F | 2 tablas Realtime |
| 0G | 4 políticas anon (bultos, rutas, profiles, resenas) |

**Ajustes hechos en sesión manual:** `disputas`, `aceptacion_automatica`/`saldo_acumulado`, política reseñas anon.

---

## Siguiente fase

- **Fase 2:** variables de entorno y deploy → [`DEPLOY-VERCEL.md`](DEPLOY-VERCEL.md)
