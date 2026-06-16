import { createClient } from "@/lib/supabase/server";
import { Header } from "./Header";
import { Main } from "./Main";
import { BottomNav } from "./BottomNav";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <NotificationProvider userId={user?.id ?? null}>
      <Header isLoggedIn={!!user} />
      <Main>{children}</Main>
      <BottomNav />
    </NotificationProvider>
  );
}
