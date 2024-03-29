"use server";

import { cookies } from "next/headers";
import { getCache } from "@/src/lib/cache/cacheService";
import { CurrentUser } from "@/src/lib/types/CurrentUser";
import { setCurrentUser } from "../services/sessionService";

export async function getCurrentUser(
  updateCookie: boolean = false
): Promise<CurrentUser | null> {
  const cookieStore = cookies();
  const authKey = cookieStore.get("authorization");

  if (!authKey) return null;

  const userCache = getCache(authKey.value);

  if (!userCache || !userCache.value) return null;

  const currentUser: CurrentUser = JSON.parse(userCache.value);

  setCurrentUser(authKey.value, currentUser, updateCookie);

  return currentUser;
}

export async function isCurrentUserInRole(
  role: string,
  updateCookie: boolean = false
): Promise<boolean> {
  const currentUser = await getCurrentUser(updateCookie);

  if (!currentUser) return false;

  return currentUser.role === role;
}
