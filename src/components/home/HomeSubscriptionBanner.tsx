import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { COMMISSION_PERCENT_LABEL } from "@/lib/constants";

export async function HomeSubscriptionBanner() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Card className="space-y-4 border-emerald-200 bg-emerald-50/80">
      <div className="space-y-2 text-base text-zinc-800 sm:text-lg">
        <p className="font-semibold text-zinc-900">
          Usar Transporte Social es gratis
        </p>
        <p>
          Registrarse, publicar viajes y buscar es gratis. Solo se paga al
          reservar un viaje: el importe se cobra por adelantado y la web lo
          retiene hasta confirmar que el viaje o el porte ha salido bien. Entonces
          se aplica un {COMMISSION_PERCENT_LABEL} de gestión.
        </p>
      </div>
      {!user && (
        <>
          <ButtonLink href="/registro" fullWidth>
            Crear cuenta gratis
          </ButtonLink>
          <p className="text-center text-xs text-zinc-500">
            <Link href="/login" className="underline">
              Inicia sesión
            </Link>{" "}
            si ya tienes cuenta
          </p>
        </>
      )}
    </Card>
  );
}
