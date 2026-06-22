import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { NuevaContrasenaForm } from "@/components/auth/NuevaContrasenaForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Nueva contraseña" };

export default async function NuevaContrasenaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/recuperar-contrasena");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900">Nueva contraseña</h1>
      <Card>
        <NuevaContrasenaForm />
      </Card>
    </div>
  );
}
