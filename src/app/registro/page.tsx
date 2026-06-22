import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { createClient } from "@/lib/supabase/server";
import { suscribirHref } from "@/lib/publication-flow";
import {
  destinoTrasRegistroPublicacion,
  mensajeRegistroRedirect,
  parseRegistroRedirect,
} from "@/lib/registro-redirect";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const redirectTo = parseRegistroRedirect(params.redirect);
  return { title: redirectTo ? "Crear suscripción" : "Crear cuenta" };
}

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const redirectTo = parseRegistroRedirect(params.redirect);
  const mensaje = mensajeRegistroRedirect(redirectTo);
  const esFlujoSuscripcion = redirectTo !== null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && redirectTo) {
    redirect(destinoTrasRegistroPublicacion(redirectTo));
  }

  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(suscribirHref(redirectTo))}`
    : "/login";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">
        {esFlujoSuscripcion ? "Crear suscripción" : "Crear cuenta"}
      </h1>
      {mensaje && (
        <p className="text-sm font-medium text-emerald-900 sm:text-base">
          {mensaje}
        </p>
      )}
      <Card>
        <RegisterForm
          redirectAfter={redirectTo}
          esFlujoSuscripcion={esFlujoSuscripcion}
        />
      </Card>
      <p className="text-center text-sm text-zinc-600">
        ¿Ya tienes cuenta?{" "}
        <Link href={loginHref} className="font-semibold text-emerald-700">
          Entrar
        </Link>
      </p>
    </div>
  );
}
