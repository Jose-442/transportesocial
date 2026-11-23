import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { despertarReloj } from "@/lib/reservas/despertar-reloj";
import { Header } from "./Header";
import { Main } from "./Main";
import { BottomNav } from "./BottomNav";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { PushEnableBanner } from "@/components/notifications/PushEnableBanner";
import { SessionDraftGuard } from "./SessionDraftGuard";

export async function AppShell({ children }: { children: React.ReactNode }) {
  after(() => {
    void despertarReloj();
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <NotificationProvider userId={user?.id ?? null}>
      <SessionDraftGuard />
      <Header isLoggedIn={!!user} />
      <Main>{children}</Main>
      <BottomNav />
      <PushEnableBanner userId={user?.id ?? null} />
    </NotificationProvider>
  );
}
