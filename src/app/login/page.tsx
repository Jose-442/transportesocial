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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Entrar</h1>
      <Card>
        <Suspense fallback={<p className="text-sm text-zinc-500">Cargando…</p>}>
          <LoginForm />
        </Suspense>
      </Card>
      <p className="text-center text-sm text-zinc-600">
        ¿No tienes cuenta?{" "}
        <Link href={registroHref} className="font-semibold text-emerald-700">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
