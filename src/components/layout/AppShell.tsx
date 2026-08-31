import { createClient } from "@/lib/supabase/server";
import { Header } from "./Header";
import { Main } from "./Main";
import { BottomNav } from "./BottomNav";
import { StripeTestBanner } from "./StripeTestBanner";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";
import { PushEnableBanner } from "@/components/notifications/PushEnableBanner";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <NotificationProvider userId={user?.id ?? null}>
      <StripeTestBanner />
      <Header isLoggedIn={!!user} />
      <Main>{children}</Main>
      <BottomNav />
      <PushEnableBanner userId={user?.id ?? null} />
    </NotificationProvider>
  );
}
