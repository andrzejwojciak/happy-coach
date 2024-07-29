"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Bot",
    href: "/admin",
  },
  { name: "Users", href: "/admin/users" },
  { name: "Challenges", href: "/admin/events" },
  { name: "Logs", href: "/admin/logs" },
];

export default function AdminNavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx("mr-3", {
              "-mb-0.5 border-b-2 border-slate-900": pathname === link.href,
            })}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
