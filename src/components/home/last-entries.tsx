import { getLastEntries } from "@/src/lib/services/recordsService";
import { Unit } from "@/src/lib/types/enums/Unit";
import Image from "next/image";

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
  const lastEntires = await getLastEntries(10);
  return (
    <div className=" ">
      Last entires goes here:
      {lastEntires.map((lastEntry) => {
        const unit = lastEntry.unit === Unit.Kilometers ? "km" : "h";
        return (
          <div key={lastEntry.id} className="flex flex-row mb-1">
            <div className="mr-1">
              <Image
                src={lastEntry.avatar}
                alt="User avatar"
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row">
                <div className="mr-1 font-semibold ">{lastEntry.username}:</div>
                <div className="text-gray-500 text-sm mt-0.5">
                  {calculateAddedTime(
                    currentTime,
                    lastEntry.created_at.getTime()
                  )}{" "}
                  ago
                </div>
              </div>
              <div>
                added {lastEntry.value}
                {unit}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
