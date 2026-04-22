"use client";

import { AdminHeader } from "./admin-header";
import { AdminSiderbar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSiderbar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6 bg-muted/10">{children}</main>
      </div>
    </div>
  );
}
