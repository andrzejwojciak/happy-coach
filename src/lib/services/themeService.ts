import { prismaClient } from "@/src/lib/data/client";
import { unstable_noStore as noStore } from "next/cache";
import { Theme } from "@/src/lib/models/Theme";

export async function getThemes(): Promise<Theme[]> {
  noStore();
  const themes = await prismaClient.theme.findMany();
  return themes.map((theme) => theme as Theme);
}

// todo: validation
export async function createTheme(theme: Theme): Promise<Theme> {
  noStore();
  const newTheme = await prismaClient.theme.create({
    data: {
      name: theme.name,
      start: theme.start,
      pawn: theme.pawn,
      finish: theme.finish,
    },
  });

  return newTheme;
}
