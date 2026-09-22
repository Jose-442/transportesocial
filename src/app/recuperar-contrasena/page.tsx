import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RecuperarContrasenaForm } from "@/components/auth/RecuperarContrasenaForm";

export const metadata = { title: "Recuperar contraseña" };

export default async function RecuperarContrasenaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const enlaceRoto =
    params.error === "enlace" ||
    (Array.isArray(params.error) && params.error[0] === "enlace");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Recuperar contraseña</h1>
      <p className="text-sm text-zinc-600">
        ¿Olvidaste la contraseña? Te mandamos un enlace al email de tu cuenta.
      </p>
      {enlaceRoto ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          Ese enlace ya no vale. Pide otro aquí abajo.
        </p>
      ) : null}
      <Card>
        <RecuperarContrasenaForm />
      </Card>
      <p className="text-center text-sm text-zinc-600">
        <Link href="/login" className="font-semibold text-emerald-700">
          Volver a entrar
        </Link>
      </p>
    </div>
  );
}
