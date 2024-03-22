import AdminNavLinks from "@/src/components/admin/admin-nav-links";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <div className="mb-10">
        <AdminNavLinks />
      </div>
      <div>{children}</div>
    </div>
  );
}
