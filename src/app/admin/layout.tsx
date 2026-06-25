import { requireAdminUser } from "@/lib/admin/require-admin";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = { title: "Panel de administración" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminUser();

  return <AdminShell>{children}</AdminShell>;
}
