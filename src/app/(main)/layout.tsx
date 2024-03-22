import Navbar from "@/src/components/layout/navbar";
import Footer from "@/src/components/layout/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full bg-white text-black flex flex-col">
      <Navbar />
      <div className="h-full flex flex-row justify-center pt-10">
        <div className="w-800">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
