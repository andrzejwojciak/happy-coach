import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-full bg-white text-black flex flex-col justify-between">
      <Navbar />
      <div className="h-full flex-1 flex justify-center  pt-6">
        <div className="w-800 ">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
