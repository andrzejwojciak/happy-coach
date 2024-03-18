import { prismaClient } from "@/src/lib/data/client";
import { User } from "@/src/lib/models/User";

export async function getOrCreateUserById(userId: string): Promise<User> {
  let result: User;

  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user) {
    result = user as User;
  } else {
    const newUser = await prismaClient.user.create({
      data: {
        id: userId,
        dataFetched: false,
        isAdmin: false,
      },
    });

    result = newUser as User;
  }

  return result;
}
