"use server";

import { slackApp } from "@/src/bot/bot";
import {
  createUser,
  getUserByCredentials,
  getUserByEmail,
} from "@/src/lib/services/userService";
import { v4 as uuid } from "uuid";
import { DataResult, Result } from "@/src/lib/types/Result";
import { RegisterModel } from "@/src/lib/types/RegisterModel";
import { getCache, removeCache, saveCache } from "@/src/lib/cache/cacheService";

type registerState = {
  state: string;
  code: string;
  sentAt: Date;
};

const registerStateExpiresIn = 1000 * 60 * 20;

export async function sendAuthCode(email: string): Promise<DataResult<string>> {
  const user = await getUserByEmail(email);

  if (user === null) {
    return {
      success: false,
      errorMessage: "Email not found",
    };
  }

  if (user.firstLoginDate) {
    return {
      success: false,
      errorMessage: "Account is already signed, please log in.",
    };
  }

  const code = generateRandomNumbers(5);
  const newGuid: string = uuid();

  const registerState: registerState = {
    state: newGuid,
    code: code,
    sentAt: new Date(),
  };

  saveCache(registerState.state, {
    value: JSON.stringify(registerState),
    expires_in: registerStateExpiresIn,
  });

  await slackApp.client.chat.postMessage({
    channel: user.id,
    text: "Here is you sign up code: " + code,
  });

  return { success: true, data: newGuid };
}

export async function verifyAuthCode(
  stateId: string,
  code: string
): Promise<Result> {
  const foundCache = getCache(stateId);

  if (!foundCache) {
    return {
      success: false,
      errorMessage:
        "You code might be expired, please refresh page and try again.",
    };
  }

  const state: registerState = JSON.parse(foundCache.value);

  if (state.code !== code) {
    return { success: false, errorMessage: "Wrong verification code" };
  }

  return { success: true };
}

export async function finishSignUp(register: RegisterModel): Promise<Result> {
  if (register.password !== register.retypedPassword) {
    return {
      success: false,
      errorMessage: "passwords do not match",
    };
  }

  const verifyAuthCodeResult = await verifyAuthCode(
    register.state,
    register.code
  );

  if (!verifyAuthCodeResult.success) verifyAuthCodeResult;

  const userCreated = await createUser({
    email: register.email,
    password: register.password,
  });

  removeCache(register.state);

  return {
    success: userCreated,
    errorMessage: userCreated ? undefined : "Something went wrong",
  };
}

export async function login({
  login,
  password,
}: {
  login: string;
  password: string;
}): Promise<Result> {
  const user = await getUserByCredentials(login, password);

  if (!user) return { success: false, errorMessage: "Wrong login or password" };

  return { success: true };
}

function generateRandomNumbers(numberOfNumbers: number): string {
  let randomNumbers = "";

  for (let i = 0; i < numberOfNumbers; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomNumbers += randomNumber;
  }

  return randomNumbers;
}
