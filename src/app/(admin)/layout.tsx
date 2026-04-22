import { AdminLayout } from "@/styles/components/features/admin/shared/admin-layout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  return <AdminLayout>{children}</AdminLayout>;
}
