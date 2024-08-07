import { prismaClient } from "@/src/lib/data/client";
import {
  OverallActivitiesSummary,
  UserOverallActivitiesSummary,
} from "@/src/lib/types/OverallActivitiesSummary";
import { Activity as ActivityEnum } from "@/src/lib/types/enums/Activity";
import { Unit } from "@/src/lib/types/enums/Unit";
import { Activity } from "@/src/lib/types/Activity";
import { unstable_noStore as noStore } from "next/cache";
import {
  getCurrentUser,
  isCurrentUserLogged,
} from "@/src/lib/actions/sessionActions";
import {
  getCurrentValues as getCurrentValuesRepositoryMethod,
  getUsersRecord as getUsersRecordRepositoryMethod,
  getUsersRecordByYear as getUsersRecordByYearRepositoryMethod,
  saveRecord as saveRecordRepositoryMethod,
} from "@/src/lib/repositories/repository";

export async function getOverallActivitiesSummary(): Promise<
  OverallActivitiesSummary[]
> {
  noStore();

  const overallActivitiesSummary = await prismaClient.record.groupBy({
    by: ["activity"],
    _sum: {
      value: true,
    },
    orderBy: {
      activity: "asc",
    },
  });

  const result: OverallActivitiesSummary[] = overallActivitiesSummary.map(
    (summary) => {
      return {
        activity: summary.activity,
        value: summary._sum.value?.toFixed(2) ?? "0",
        unit: getUnitFromActivity(
          convertStringToActivityEnum(summary.activity)
        ),
      };
    }
  );

  return result;
}

export async function getCurrentUserOverallActivitiesSummary(): Promise<
  UserOverallActivitiesSummary[] | null
> {
  noStore();

  const currentUser = await getCurrentUser();

  if (!currentUser) return null;

  const userOverallActivitiesSummary = await prismaClient.record.groupBy({
    by: ["userId", "activity"],
    where: {
      userId: currentUser.id,
    },
    _sum: {
      value: true,
    },
    orderBy: {
      activity: "asc",
    },
  });

  const result: UserOverallActivitiesSummary[] =
    userOverallActivitiesSummary.map((summary) => {
      return {
        userId: currentUser.id,
        activity: summary.activity,
        value: summary._sum.value?.toFixed(2) ?? "0",
        unit: getUnitFromActivity(
          convertStringToActivityEnum(summary.activity)
        ),
      };
    });

  return result;
}

export async function getLastEntries(
  numberOfLastEntries: number
): Promise<Activity[]> {
  noStore();

  const isLogged = await isCurrentUserLogged();

  const recentRecords = await prismaClient.record.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: numberOfLastEntries,
    include: {
      user: true,
    },
  });

  const result: Activity[] = recentRecords.map((recentRecord) => {
    return {
      id: recentRecord.id,
      userId: recentRecord.userId,
      avatar:
        !isLogged || recentRecord.user.image_72 === null
          ? "https://pbs.twimg.com/media/EWAJB4WUcAAje8s.png"
          : recentRecord.user.image_72,
      username:
        "@" +
        (isLogged
          ? recentRecord.user.display_name ?? "Anonymous"
          : (recentRecord.user.display_name?.substring(0, 1) ?? "U") +
            ".".repeat(recentRecord.user.display_name?.length ?? 5)),
      activity: convertStringToActivityEnum(recentRecord.activity),
      unit: getUnitFromActivity(
        convertStringToActivityEnum(recentRecord.activity)
      ),
      message: recentRecord.message,
      value: recentRecord.value,
      created_at: recentRecord.created_at,
    };
  });

  return result;
}

function getUnitFromActivity(activity: ActivityEnum): Unit {
  switch (activity) {
    case ActivityEnum.Distance:
      return Unit.Kilometers;
    case ActivityEnum.Time:
      return Unit.Hours;
    default:
      return Unit.Default;
  }
}

function convertStringToActivityEnum(activity: string): ActivityEnum {
  switch (activity) {
    case ActivityEnum.Distance:
      return ActivityEnum.Distance;
    case ActivityEnum.Time:
      return ActivityEnum.Time;
    default:
      return ActivityEnum.Default;
  }
}

export function prepareMessage(
  newRecords: number[],
  currentSum: number,
  unit: string
): string {
  const recordsSum = newRecords.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  const initial = currentSum - recordsSum;
  let message = `${initial.toFixed(2)}${unit}`;

  newRecords.forEach((record) => {
    message += " + " + record.toFixed(2) + unit;
  });

  message += ` = ${currentSum}${unit}`;

  return message;
}

export async function addRecords(
  logMessage: string,
  message: string,
  userId: string
): Promise<string> {
  const distance = getNumbersFromMessage(message, "km");
  const hours = getNumbersFromMessage(message, "h");
  getNumbersFromMessage(message, "min").forEach((minute) =>
    hours.push(minute / 60)
  );

  console.log("distance", distance);
  console.log("hours", hours);

  let responseMessage: string = "";

  if (hours.length) {
    await saveRecord(userId, logMessage, "time", hours);
    const sum = await getCurrentValues("time");
    console.log("time sum", sum);
    responseMessage += prepareMessage(hours, sum, "h");
  }

  if (distance.length) {
    await saveRecord(userId, logMessage, "distance", distance);
    const sum = await getCurrentValues("distance");
    console.log("distance sum", sum);
    responseMessage += "\n" + prepareMessage(distance, sum, "km");
  }

  return responseMessage;
}

export function getNumbersFromMessage(message: string, unit: string): number[] {
  const regex = new RegExp(`\\+[0-9][0-9]{0,2}(?:[.,][0-9]{0,2})?${unit}`, "g");
  const matches = message.match(regex);

  let numbers: number[] = [];

  matches?.forEach((match) => {
    match = match.replace(",", ".");
    const foundNumber = match.match(/[0-9]\d{0,2}(?:[.][0-9]{0,2})?/);

    if (foundNumber) numbers.push(Number(foundNumber[0]));
  });

  return numbers;
}

export async function getCurrentValues(activity: string): Promise<number> {
  const totalValue = await getCurrentValuesRepositoryMethod(activity);
  return Number(totalValue.toFixed(2));
}

export async function getUsersRecordByYear(
  year: number,
  activity: string
): Promise<string> {
  let message: string = "";

  const unit = activity === "distance" ? "km" : "h";

  const records = await getUsersRecordByYearRepositoryMethod(year, activity);

  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.totalValue;
  }, 0);

  message += `sum: ${sum.toFixed(2)}${unit}`;

  records.forEach(
    (record) =>
      (message += `\n<@${record.userId}> - ${record.totalValue.toFixed(
        2
      )}${unit}`)
  );

  return message;
}

export async function getUsersRecord(activity: string): Promise<string> {
  let message: string = "";
  const unit = activity === "distance" ? "km" : "h";

  const records = await getUsersRecordRepositoryMethod(activity);

  const sum = records.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.totalValue;
  }, 0);

  message += `sum: ${sum.toFixed(2)}${unit}`;

  records.forEach(
    (record) =>
      (message += `\n<@${record.userId}> - ${record.totalValue.toFixed(
        2
      )}${unit}`)
  );

  return message;
}

export async function saveRecord(
  userId: string,
  message: string,
  activity: string,
  values: number[]
): Promise<void> {
  const valuesSum = values.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  const record = {
    userId: userId,
    value: Number(valuesSum.toFixed(2)),
    activity: activity,
    message: message,
  };

  await saveRecordRepositoryMethod(record);
}
