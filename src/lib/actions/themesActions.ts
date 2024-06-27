"use server";

import { Theme } from "@/src/lib/models/Theme";
import { getThemes } from "@/src/lib/services/themeService";

export async function getThemesAction(): Promise<Theme[]> {
  return await getThemes();
}
