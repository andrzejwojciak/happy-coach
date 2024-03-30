import LastEntires from "@/src/components/home/last-entries";
import OverallActivitySummary from "@/src/components/home/overall-activity-summary";

export default async function Home() {
  return (
    <div>
      <div className="flex flex-row justify-between">
        <div>
          <OverallActivitySummary />
        </div>
        <div className="w-2/5">
          <LastEntires />
        </div>
      </div>
    </div>
  );
}
