import { slackApp } from "@/src/bot/bot";
import { prismaClient } from "@/src/lib/data/client";
import { User } from "@/src/lib/models/User";
import {
  comparePasswords,
  hashPassword,
} from "@/src/lib/services/cryptService";
import { PaginationRequest } from "../types/PaginationRequest";
import { unstable_noStore as noStore } from "next/cache";

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

  if (!result.dataFetched) synchronizeUserData(result.id);

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

export async function getUserByCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user || !user.password_hash) return null;

  if ((await isPasswordMatching(user.password_hash, password)) === true)
    return user as User;

  return null;
}

export async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<boolean> {
  const user = await getUserByEmail(email);
  if (!user || user.firstLoginDate !== null) return false;

  const hashedPassword = await hashPassword(password);

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      firstLoginDate: new Date(),
      password_hash: hashedPassword,
    },
  });

  return true;
}

export async function getUsers(pagination: PaginationRequest): Promise<User[]> {
  noStore();
  const results = await prismaClient.user.findMany({
    skip: pagination.page * pagination.perPage,
    take: pagination.perPage,
  });

  return results.map((user) => {
    const newUser = user as User;
    newUser.displayName = user.display_name ?? undefined;
    return newUser;
  });
}

export async function setIsAdmin(
  userId: string,
  isAdmin: boolean
): Promise<boolean> {
  const updated = await prismaClient.user.update({
    where: { id: userId },
    data: {
      isAdmin: isAdmin,
    },
  });

  return updated !== null;
}

export async function getSynchronizedUserData(
  userId: string
): Promise<User | null> {
  const fetchedUser = await slackApp.client.users.info({
    user: userId,
  });

  if (!fetchedUser.ok) return null;

  console.log(fetchedUser);

  const updatedUser = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      email: fetchedUser.user?.profile?.email,
      display_name:
        fetchedUser.user?.profile?.display_name ??
        fetchedUser.user?.profile?.real_name ??
        fetchedUser.user?.name ??
        fetchedUser.user?.profile?.email,
      image_24: fetchedUser.user?.profile?.image_24,
      image_32: fetchedUser.user?.profile?.image_32,
      image_48: fetchedUser.user?.profile?.image_48,
      image_72: fetchedUser.user?.profile?.image_72,
      dataFetched: true,
    },
  });

  return updatedUser as User;
}

export async function userExists(userId: string): Promise<boolean> {
  const userExist = await prismaClient.user.count({
    where: {
      id: userId,
    },
  });

  return userExist === 1;
}

async function isPasswordMatching(
  hashedPassword: string,
  passwordAttempt: string
): Promise<boolean> {
  const isMatch = await comparePasswords(hashedPassword, passwordAttempt);
  return isMatch;
}

export async function synchronizeUserData(id: string) {
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
