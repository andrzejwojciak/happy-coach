import NavLinks from "@/src/components/layout/nav-links";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/src/lib/actions/sessionActions";

export default async function Navbar() {
  const currentUser = await getCurrentUser();
  let userRole: string | undefined;
  let isLoggedIn: boolean = false;

  if (currentUser) {
    (userRole = currentUser.role), (isLoggedIn = true);
  }

  return (
    <div className="flex justify-center">
      <div className="w-900 flex flex-row justify-between">
        <div>
          <Link href="/">
            <Image
              src="/images/happy-coach-logo-black.webp"
              alt="HappyCoach logo"
              width={110}
              height={68.5}
            />
          </Link>
        </div>
        <div className="flex flex-row items-center">
          <NavLinks userRole={userRole} />
          {isLoggedIn && (
            <Link
              href={""}
              className="flex flex-row w-24 bg-black rounded-lg text-white justify-center p-1.5 hover:bg-slate-700"
            >
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
