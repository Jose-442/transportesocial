import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawRedirect = Array.isArray(params.redirect)
    ? params.redirect[0]
    : params.redirect;
  const registroHref = rawRedirect
    ? `/registro?redirect=${encodeURIComponent(rawRedirect)}`
    : "/registro";
  const esRedirectBulto =
    typeof rawRedirect === "string" && rawRedirect.startsWith("/bultos/");
  const contrasenaActualizada =
    params.ok === "contrasena" ||
    (Array.isArray(params.ok) && params.ok[0] === "contrasena");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Entrar</h1>
      {contrasenaActualizada && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Contraseña actualizada. Ya puedes entrar.
        </p>
      )}
      {esRedirectBulto && (
        <p className="text-base text-zinc-600">
          Casi listo. Inicia sesión o crea cuenta para enviar tu propuesta de
          precio. El solicitante solo verá tu oferta cuando estés registrado.
        </p>
      )}
      <Card>
        <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
          <LoginForm />
        </Suspense>
      </Card>
      <p className="text-center text-sm text-zinc-600">
        <Link
          href="/recuperar-contrasena"
          className="font-semibold text-emerald-700"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
      <p className="text-center text-sm text-zinc-600">
        ¿No tienes cuenta?{" "}
        <Link href={registroHref} className="font-semibold text-emerald-700">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
