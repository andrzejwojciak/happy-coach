import { getLastEntries } from "@/src/lib/services/recordsService";
import { Unit } from "@/src/lib/types/enums/Unit";

function calculateAddedTime(currentTime: number, created_at: number): string {
  const differenceInMilliseconds = currentTime - created_at;
  const differenceInMinutes = Math.round(
    differenceInMilliseconds / (1000 * 60)
  );

  let message: string;

  if (differenceInMinutes >= 60) {
    message = Math.round(differenceInMinutes / 60) + " hours";
  } else {
    message = differenceInMinutes + " minutes";
  }

  return message;
}

export default async function LastEntires() {
  const currentTime = new Date().getTime();
  const lastEntires = await getLastEntries(8);
  return (
    <div>
      SOME LAST ENTRIES WIP
      {lastEntires.map((lastEntry) => {
        const unit = lastEntry.unit === Unit.Kilometers ? "km" : "h";
        return (
          <div key={lastEntry.id}>
            {lastEntry.ussername}: added {lastEntry.value}
            {unit} about{" "}
            {calculateAddedTime(currentTime, lastEntry.created_at.getTime())}{" "}
            ago
          </div>
        );
      })}
    </div>
  );
}
