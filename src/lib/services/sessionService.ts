import { cookies } from "next/headers";
import { getCache, saveCache } from "@/src/lib/cache/cacheService";
import { CurrentUser } from "@/src/lib/types/CurrentUser";
import { unstable_noStore as noStore } from "next/cache";

export function getCurrentUser(): CurrentUser | null {
  noStore();

  const cookieStore = cookies();
  const authKey = cookieStore.get("authorization");

  if (!authKey) return null;

  const userCache = getCache(authKey.value);

  if (!userCache || !userCache.value) return null;

  const currentUser: CurrentUser = JSON.parse(userCache.value);

  return currentUser;
}

export function setCurrentUser(key: string, currentUser: CurrentUser): void {
  const currentDate = new Date();
  const expiryDate = addHours(currentDate, 1);

  saveCache(key, {
    value: JSON.stringify(currentUser),
    clearAfter: expiryDate,
  });

  cookies().set("authorization", key, { expires: addHours(new Date(), 1) });
}

function addHours(date: Date, hours: number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  const newDate = new Date(date);
  newDate.setTime(date.getTime() + hoursToAdd);
  return newDate;
}
