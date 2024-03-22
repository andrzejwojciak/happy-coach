"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function AfterRedirectMessage() {
  const searchParams = useSearchParams();
  const accountCreated = searchParams.get("accountCreated");

  return (
    <div className="text-emerald-600">
      {accountCreated === "true" ? <p>Now you can login</p> : null}
    </div>
  );
}

export default function LoginPage() {
  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Suspense>
          <AfterRedirectMessage />
        </Suspense>
        <div className="flex flex-col font-bold">
          <div>
            Login <br />
            <input
              className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
              placeholder="example@domain.com"
            />
          </div>
          <div className="mt-10">
            Password <br />
            <input
              className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
              placeholder="**********"
              type="password"
            />
          </div>
          <div className="mt-10">
            <button className="bg-black hover:bg-sky-800 h-10 w-full rounded-lg text-white text-lg">
              Login
            </button>
          </div>
        </div>
        <div>
          No account?{" "}
          <Link className="text-sky-700 hover:text-sky-500" href="/register">
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
}
