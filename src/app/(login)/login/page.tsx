"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { login } from "@/src/lib/actions/authActions";

type LoginForm = { login: string; password: string };

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
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [inputValue, setInputValue] = useState<LoginForm>({
    login: "",
    password: "",
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!inputValue.login || !inputValue.password) return;

    const loginResult = await login({
      login: inputValue.login,
      password: inputValue.password,
    });

    if (!loginResult.success)
      setLoginError(loginResult.errorMessage ?? "something went wrong");

    if (loginResult.data) {
      localStorage.setItem("authorization", loginResult.data);
      router.push("/");
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
              value={inputValue.login}
              type="text"
              name="login"
              onChange={handleChange}
            />
          </div>
          <div className="mt-10">
            Password <br />
            <input
              className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
              placeholder="**********"
              type="password"
              value={inputValue.password}
              name="password"
              onChange={handleChange}
            />
            <p className="text-rose-700">{loginError}</p>
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
