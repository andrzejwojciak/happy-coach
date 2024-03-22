"use server";

import { slackApp } from "@/src/bot/bot";
import { getUserByEmail } from "@/src/lib/services/userService";
import { v4 as uuidv4 } from "uuid";
import { Result } from "@/src/lib/types/result";
import { RegisterModel } from "@/src/lib/types/RegisterModel";

const registerStates: registerState[] = [];

type registerState = {
  state: string;
  code: string;
  sentAt: Date;
};

export async function sendAuthCode(email: string): Promise<Result> {
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
      errorMessage: "Account is already signed, please log in",
    };
  }

  const code = generateRandomNumbers(5);
  const newGuid: string = uuidv4();

  const registerState: registerState = {
    state: newGuid,
    code: code,
    sentAt: new Date(),
  };

  registerStates.push(registerState);

  await slackApp.client.chat.postMessage({
    channel: user.id,
    text: "Here is you sign up code: " + code,
  });

  return { success: true, state: newGuid };
}

export async function verifyAuthCode(
  state: string,
  code: string
): Promise<Result> {
  const foundState = registerStates.find(
    (registerState) => registerState.state === state
  );

  if (!foundState) {
    return {
      success: false,
      errorMessage:
        "You code might be expired, please refresh page and try again.",
    };
  }

  if (foundState.code !== code) {
    return { success: false, errorMessage: "Wrong veryfication code" };
  }

  return { success: true };
}

export async function finishSignup(register: RegisterModel) {
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

  if (!verifyAuthCodeResult.success) {
    return {
      success: verifyAuthCodeResult.success,
      errorMessage:
        verifyAuthCodeResult.errorMessage ?? "Something went wrong...",
    };
  }

  return {
    success: true,
  };
}

function generateRandomNumbers(numberOfNumbers: number): string {
  let randomNumbers = "";

  for (let i = 0; i < numberOfNumbers; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    randomNumbers += randomNumber;
  }

  return randomNumbers;
}
