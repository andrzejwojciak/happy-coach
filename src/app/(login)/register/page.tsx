"use client";

import {
  sendAuthCode as sendAuthCodeAction,
  verifyAuthCode as verifyAuthCodeAction,
  finishSignUp as finishSignUpAction,
} from "@/src/lib/actions/authActions";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Register = {
  email: string;
  password: string;
  retypedPassword: string;
  code: string;
  state: string;
  emailVerified: boolean;
  authCodeSent: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const [emailError, setEmailError] = useState<string>();
  const [emailVerifyError, setEmailVerifyError] = useState<string>();
  const [singUpError, setSingUpError] = useState<string>();
  const [inputValue, setInputValue] = useState<Register>({
    email: "",
    password: "",
    retypedPassword: "",
    code: "",
    state: "",
    emailVerified: false,
    authCodeSent: false,
  });

  async function buttonClick(event: React.FormEvent) {
    event.preventDefault;

    if (!inputValue.emailVerified && !inputValue.authCodeSent) {
      await sendAuthCode(event);
      return;
    }

    if (!inputValue.emailVerified && inputValue.authCodeSent) {
      await verifyAuthCode(event);
      return;
    }

    if (inputValue.emailVerified && inputValue.authCodeSent) {
      await finishSignUp(event);
      return;
    }
  }

  async function sendAuthCode(event: React.FormEvent) {
    if (!inputValue?.email) return;

    const response = await sendAuthCodeAction(inputValue.email);

    if (!response.success) {
      setEmailError(response.errorMessage);
      return;
    }

    setEmailError("");
    setInputValue((prevState) => ({
      ...prevState,
      authCodeSent: true,
      state: response.data ?? "error",
    }));
  }

  async function verifyAuthCode(event: React.FormEvent) {
    if (!inputValue?.code) return;

    const response = await verifyAuthCodeAction(
      inputValue.state,
      inputValue.code
    );

    if (!response.success) {
      setEmailVerifyError(response.errorMessage);
      return;
    }

    setEmailError("");
    setInputValue((prevState) => ({
      ...prevState,
      emailVerified: true,
    }));
  }

  async function finishSignUp(event: React.FormEvent) {
    console.log(inputValue);

    if (!inputValue?.password) return;

    const response = await finishSignUpAction({
      email: inputValue.email,
      password: inputValue.password,
      retypedPassword: inputValue.retypedPassword,
      code: inputValue.code,
      state: inputValue.state,
    });

    if (!response.success) {
      setSingUpError(response.errorMessage ?? "");
      return;
    }

    router.push("/login?accountCreated=true");
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col font-bold">
          <div>
            Your slack email <br />
            <input
              value={inputValue.email}
              type="text"
              name="email"
              disabled={inputValue.authCodeSent}
              onChange={handleChange}
              className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
              placeholder="example@domain.com"
            />
            <p className="text-rose-700">{emailError}</p>
          </div>
          {!inputValue.emailVerified && inputValue.authCodeSent ? (
            <div>
              <div className="mt-10">
                Auth code sent to you on slack <br />
                <input
                  value={inputValue.code}
                  type="text"
                  name="code"
                  onChange={handleChange}
                  className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
                  placeholder="12345"
                />
                <p className="text-rose-700">{emailVerifyError}</p>
              </div>
            </div>
          ) : null}
          {inputValue.emailVerified ? (
            <>
              <div className="mt-10">
                Password <br />
                <input
                  value={inputValue.password}
                  className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
                  placeholder="**********"
                  type="password"
                  onChange={handleChange}
                  name="password"
                />
              </div>
              <div className="mt-10">
                Re-typed password <br />
                <input
                  value={inputValue.retypedPassword}
                  className="border-2 border-sky-500-1 rounded-lg w-full h-10 px-2 font-normal"
                  placeholder="**********"
                  type="password"
                  onChange={handleChange}
                  name="retypedPassword"
                />
              </div>
              <div className="text-rose-700">{singUpError}</div>
            </>
          ) : null}
          <div className="mt-10">
            <button
              className="bg-black hover:bg-sky-800 h-10 w-full rounded-lg text-white text-lg"
              onClick={buttonClick}
            >
              {inputValue.emailVerified
                ? "Create an account"
                : inputValue.authCodeSent
                ? "Verify email"
                : "Send code"}
            </button>
          </div>
        </div>
        <div>
          Do you already have an account?{" "}
          <Link className="text-sky-700 hover:text-sky-500" href="/login">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
