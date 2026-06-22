import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RecuperarContrasenaForm } from "@/components/auth/RecuperarContrasenaForm";

export const metadata = { title: "Recuperar contraseña" };

export default function RecuperarContrasenaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Recuperar contraseña</h1>
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
