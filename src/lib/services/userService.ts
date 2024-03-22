import { slackApp } from "@/src/bot/bot";
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

  if (!user?.dataFetched) synchronizeUserData(result.id);

  return result;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  return user as User;
}

async function synchronizeUserData(id: string) {
  const fetchedUser = await slackApp.client.users.info({
    user: id,
  });

  if (!fetchedUser.ok) return;

  await prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      email: fetchedUser.user?.profile?.email,
      display_name: fetchedUser.user?.profile?.display_name,
      image_24: fetchedUser.user?.profile?.image_24,
      image_32: fetchedUser.user?.profile?.image_32,
      image_48: fetchedUser.user?.profile?.image_48,
      image_72: fetchedUser.user?.profile?.image_72,
      dataFetched: true,
    },
  });
}
