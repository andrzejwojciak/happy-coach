import AdminNavLinks from "@/src/components/admin/admin-nav-links";
import {
  getCurrentUser,
  isCurrentUserInRole,
} from "@/src/lib/actions/sessionActions";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isCurrentUserInRole("admin")) {
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
