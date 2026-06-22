import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { loadDisputasAbiertas } from "@/actions/admin-disputas";
import { DisputasAdminPanel } from "@/components/admin/DisputasAdminPanel";

export const metadata = { title: "Disputas abiertas" };

export default async function AdminDisputasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/disputas");
  }
  if (!isAdminUser(user)) {
    redirect("/");
  }

  const disputas = await loadDisputasAbiertas();

  return (
    <div className="space-y-4">
      <Link
        href="/cuenta"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-emerald-700"
      >
        ← Mi cuenta
      </Link>
      <h1 className="text-2xl font-bold text-zinc-900">Disputas abiertas</h1>
      <DisputasAdminPanel disputas={disputas} />
    </div>
  );
}
