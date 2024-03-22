import NavLinks from "@/src/components/layout/nav-links";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const isLoggedIn = false;
  return (
    <div className="flex justify-center">
      <div className="w-900 flex flex-row justify-between">
        <div>
          <Link href="/">
            <Image
              src="/happy-coach-logo-black.png"
              alt="HappyCoach logo"
              width={110}
              height={68.5}
            />
          </Link>
        </div>
        <div className="flex flex-row items-center">
          <NavLinks />
          {isLoggedIn && (
            <Link href={""} className="flex flex-row w-24">
              Sign out
            </Link>
          )}
          {!isLoggedIn && (
            <Link
              href={"/login"}
              className="flex flex-row w-24 bg-black rounded-lg text-white justify-center p-1.5 hover:bg-slate-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
