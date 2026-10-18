import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseErrorMessage } from "@/lib/supabase/errors";
import {
  normalizarDocumentoIdentidad,
  normalizarTelefonoEs,
} from "@/lib/identidad";

/**
 * Guarda teléfono y DNI/NIE sin recargar la página (a diferencia de la
 * server action, que en Next.js refresca la ruta y corta el ir al pago).
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      telefono?: string;
      documento?: string;
    };
    const telefono = normalizarTelefonoEs(String(body.telefono ?? ""));
    if (!telefono) {
      return NextResponse.json(
        { errorTelefono: "Por favor, introduce un número de teléfono válido" },
        { status: 400 }
      );
    }
    const documento = normalizarDocumentoIdentidad(String(body.documento ?? ""));
    if (!documento) {
      return NextResponse.json(
        {
          errorDocumento:
            "El DNI o NIE introducido no es válido. Revisa los números y la letra",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        phone: telefono,
        documento_identidad: documento,
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json(
        { error: supabaseErrorMessage(error) },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se ha podido guardar. Prueba otra vez." },
      { status: 500 }
    );
  }
}
