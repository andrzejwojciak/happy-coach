import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authCookie = request.cookies.get("authorization");
  if (authCookie)
    response.cookies.set("authorization", authCookie.value, {
      expires: addHours(new Date(), 1),
    });

  return response;
}

function addHours(date: Date, hours: number) {
  const hoursToAdd = hours * 60 * 60 * 1000;
  const newDate = new Date(date);
  newDate.setTime(date.getTime() + hoursToAdd);
  return newDate;
}
