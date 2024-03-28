import AdminNavLinks from "@/src/components/admin/admin-nav-links";
import { getCurrentUser } from "@/src/lib/services/sessionService";
import { redirect } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="">
      <div className="mb-10">
        <AdminNavLinks />
      </div>
      <div>{children}</div>
    </div>
  );
}
