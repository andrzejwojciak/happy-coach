import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HappyCoach",
  description: "I'm HappyCoach, an activity counting slack bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <div className="h-screen w-screen text-blac bg-white text-black flex flex-col">
          <Navbar />
          <div className="h-full flex flex-row justify-center pt-10">
            <div className="w-800">{children}</div>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
