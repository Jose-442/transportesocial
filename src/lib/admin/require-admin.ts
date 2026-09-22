import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminUser } from "@/lib/admin";
import { hrefLoginConVuelta } from "@/lib/safe-redirect";

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(hrefLoginConVuelta("/admin"));
  }
  if (!isAdminUser(user)) {
    redirect("/");
  }
  return user;
}

export function getAdminDb() {
  return createAdminClient();
}
