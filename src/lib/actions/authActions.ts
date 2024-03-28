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
import {
  getCache,
  removeCacheByKey,
  saveCache,
} from "@/src/lib/cache/cacheService";
import { cookies } from "next/headers";
import { CurrentUser } from "../types/CurrentUser";
import { setCurrentUser } from "../services/sessionService";

type RegisterState = {
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
      errorMessage: "Email is not listed as an active channel member",
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

  const registerState: RegisterState = {
    state: newGuid,
    code: code,
    sentAt: new Date(),
  };

  saveCache(registerState.state, {
    value: JSON.stringify(registerState),
    expiresIn: registerStateExpiresIn,
  });

  await slackApp.client.chat.postMessage({
    channel: user.id,
    text: "Here is your sign up code: " + code,
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

  const state: RegisterState = JSON.parse(foundCache.value);

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

  removeCacheByKey(register.state);

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
}): Promise<DataResult<string>> {
  if (login === "checking") console.log(getCache(password));

  const user = await getUserByCredentials(login, password);

  if (!user) return { success: false, errorMessage: "Wrong login or password" };

  const newGuid: string = uuid();
  const currentUser: CurrentUser = {
    email: user.email!,
    role: user.isAdmin ? "admin" : "user",
    displayName: user.displayName!,
    loggedAt: new Date(),
  };

  setCurrentUser(newGuid, currentUser);

  return { success: true, data: newGuid };
}

function generateRandomNumbers(numberOfNumbers: number): string {
  let randomNumbers = "";

  for (let i = 0; i < numberOfNumbers; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomNumbers += randomNumber;
  }

  return randomNumbers;
}

function addHours(date: Date, hours: number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  const newDate = new Date(date);
  newDate.setTime(date.getTime() + hoursToAdd);
  return newDate;
}

function addSeconds(date: Date, seconds: number) {
  const secondsToAdd = seconds * 1000;
  const newDate = new Date(date);
  newDate.setTime(date.getTime() + secondsToAdd);
  return newDate;
}
