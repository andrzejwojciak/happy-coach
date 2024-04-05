"use server";

import { Theme } from "@/src/lib/models/Theme";
import { getThemes as getThemesServiceMethod } from "@/src/lib/services/themeService";

export async function getThemes(): Promise<Theme[]> {
  return await getThemesServiceMethod();
}
