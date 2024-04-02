"use server";

import { Result, DataResult } from "@/src/lib/types/Result";
import {
  getCurrentUser,
  isCurrentUserInRole,
} from "@/src/lib/actions/sessionActions";
import {
  getOrCreateUserById,
  getSynchronizedUserData,
  setIsAdmin,
  userExists,
  getUsers as getUserServiceMethod,
} from "@/src/lib/services/usersService";
import { PaginationRequest } from "@/src/lib/types/PaginationRequest";
import { User } from "@/src/lib/models/User";

export async function getUsers(
  pagination: PaginationRequest
): Promise<DataResult<User[]>> {
  if (!(await isCurrentUserInRole("admin"))) {
    return {
      success: false,
      errorMessage: "You do not have permission to perform this action",
    };
  }

  const users = await getUserServiceMethod(pagination);

  return { success: true, data: users };
}

export async function switchIsAdmin(userId: string): Promise<Result> {
  if (!(await isCurrentUserInRole("admin"))) {
    return {
      success: false,
      errorMessage: "You do not have permission to perform this action",
    };
  }

  const user = await getOrCreateUserById(userId);

  if (!user) {
    return { success: false, errorMessage: "User does not exist" };
  }

  const updated = await setIsAdmin(user.id, !user.isAdmin);

  return {
    success: updated,
    errorMessage: updated ? undefined : "Something went wrong",
  };
}

export async function fetchUserData(userId: string): Promise<Result> {
  if (!(await isCurrentUserInRole("admin"))) {
    return {
      success: false,
      errorMessage: "You do not have permission to perform this action",
    };
  }

  if (!(await userExists(userId))) {
    return { success: false, errorMessage: "User does not exist" };
  }

  const user = await getSynchronizedUserData(userId);

  return {
    success: user !== null,
    errorMessage: user !== null ? undefined : "Something went wrong",
  };
}
