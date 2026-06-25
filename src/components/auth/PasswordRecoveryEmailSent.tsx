import Link from "next/link";
import { LEGAL_TITULAR } from "@/lib/legal-info";

export function PasswordRecoveryEmailSent({
  email,
}: {
  email?: string | null;
}) {
  return (
    <div className="space-y-3 text-sm text-zinc-700">
      <p className="font-medium text-emerald-800">
        {email
          ? `Si ${email} está registrado, te hemos enviado un enlace para elegir una contraseña nueva.`
          : "Si ese email está registrado, te hemos enviado un enlace para elegir una contraseña nueva."}
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Revisa la <strong>bandeja de entrada</strong>, <strong>Spam</strong> y{" "}
          <strong>Promociones</strong>. El remitente suele ser{" "}
          <span className="text-zinc-600">noreply@mail.app.supabase.io</span>.
        </li>
        <li>Puede tardar unos minutos en llegar.</li>
        <li>
          Por seguridad, solo puedes pedir un enlace <strong>cada 60 segundos</strong>.
          Si has pulsado varias veces, espera <strong>1 hora</strong> antes de
          volver a intentarlo.
        </li>
        <li>
          Al abrir el enlace, te pediremos la <strong>nueva contraseña</strong> en
          esta web.
        </li>
      </ul>
      <p className="text-xs text-zinc-500">
        ¿Sigue sin llegar? Escríbenos a{" "}
        <a
          href={`mailto:${LEGAL_TITULAR.email}`}
          className="font-semibold text-emerald-700"
        >
          {LEGAL_TITULAR.email}
        </a>{" "}
        o usa el enlace de abajo para volver a entrar si ya recuerdas la
        contraseña.
      </p>
      <p className="text-center">
        <Link href="/login" className="font-semibold text-emerald-700">
          Volver a entrar
        </Link>
      </p>
    </div>
  );
}
