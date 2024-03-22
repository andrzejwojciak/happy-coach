import Link from "next/link";
import Image from "next/image";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full bg-white text-black flex place-items-center justify-center">
      <div className="border-black-2">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/happy-coach-logo-black.png"
              alt="HappyCoach logo"
              width={300}
              height={300}
            />
          </Link>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
