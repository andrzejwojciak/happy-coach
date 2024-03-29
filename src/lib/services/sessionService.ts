import { cookies } from "next/headers";
import { saveCache } from "@/src/lib/cache/cacheService";
import { CurrentUser } from "@/src/lib/types/CurrentUser";

export function setCurrentUser(
  key: string,
  currentUser: CurrentUser,
  updateCookie: boolean
): void {
  const currentDate = new Date();
  const expiryDate = addHours(currentDate, 1);

  saveCache(key, {
    value: JSON.stringify(currentUser),
    clearAfter: expiryDate,
  });

  if (updateCookie)
    cookies().set("authorization", key, { expires: addHours(new Date(), 1) });
}

function addHours(date: Date, hours: number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  const newDate = new Date(date);
  newDate.setTime(date.getTime() + hoursToAdd);
  return newDate;
}
