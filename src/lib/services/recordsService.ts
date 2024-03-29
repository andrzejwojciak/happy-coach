import { prismaClient } from "@/src/lib/data/client";
import {
  OverallActivitiesSummary,
  UserOverallActivitiesSummary,
} from "@/src/lib/types/OverallActivitiesSummary";
import { Activity as ActivityEnum } from "@/src/lib/types/enums/Activity";
import { Unit } from "@/src/lib/types/enums/Unit";
import { Activity } from "@/src/lib/types/Activity";
import { unstable_noStore as noStore } from "next/cache";
import { getCurrentUser } from "@/src/lib/actions/sessionActions";

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
  const recentRecords = await prismaClient.record.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: numberOfLastEntries,
  });

  const result: Activity[] = recentRecords.map((recentRecord) => {
    return {
      id: recentRecord.id,
      userId: recentRecord.userId,
      username: "@username",
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
