"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  {
    name: "Admin",
    href: "/admin",
    roleRequired: "admin",
  },
  {
    name: "About",
    href: "/about",
  },
];

export default function NavLinks({ userRole }: { userRole?: string }) {
  let pathname = usePathname();
  pathname = "/" + pathname.split("/")[1];
  return (
    <>
      {links.map((link) => {
        if (link.roleRequired && link.roleRequired !== userRole) return;

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
