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
          <Image
            src="/happy-coach-logo-black.png"
            alt="HappyCoach logo"
            width={110}
            height={68.5}
          />
        </div>
        <div className="flex flex-row items-center">
          <NavLinks />
          {isLoggedIn && (
            <Link href={""} className="flex flex-row w-24">
              <p>Sign out</p> <ArrowLeftEndOnRectangleIcon className="w-6" />
            </Link>
          )}
          {!isLoggedIn && (
            <Link href={""} className="flex flex-row w-24">
              <p>Sign in</p> <ArrowLeftStartOnRectangleIcon className="w-6" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
