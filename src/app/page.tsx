import Events from "@/src/components/events";

export default async function Home() {
  const value = "something here happend";
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="min-h-80">
        <div className="flex font-bold text-8xl z-10 max-w-5xl w-full items-center">
          <div className="text-blue-600">Happy</div>
          <div className="text-yellow-300">Coach</div>
        </div>
        <div className="bg-slate-200 min-h-80 text-black">
          <Events />
        </div>
        <div className="bg-gray-300 min-h-80">
          <div className="text-black">{value}</div>
        </div>
      </div>
    </main>
  );
}
