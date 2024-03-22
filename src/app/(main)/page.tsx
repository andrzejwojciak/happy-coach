import LastEntires from "@/src/components/last-entries";
import OverallActivitySummary from "@/src/components/overall-activity-summary";

export default async function Home() {
  return (
    <div>
      <div className="flex flex-row">
        <div className="w-1/2">
          <OverallActivitySummary />
        </div>
        <div className="w-1/2">
          <LastEntires />
        </div>
      </div>
    </div>
  );
}
