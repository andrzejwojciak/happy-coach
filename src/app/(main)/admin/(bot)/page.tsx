"use client";

import {
  startBotAction,
  stopBotAction,
  getBotStatusAction,
} from "@/src/lib/actions/botActions";
import { useEffect, useState } from "react";

export default function Bot() {
  const [botStatus, setBotStatus] = useState("fetching...");

  useEffect(() => {
    getBotStatusAction().then((status: string) => {
      setBotStatus(status);
    });
  }, []);

  async function updateBotStatus() {
    const status = await getBotStatusAction();
    setBotStatus(status);
  }

  async function startBot() {
    await startBotAction();
    await updateBotStatus();
  }
  async function stopBot() {
    await stopBotAction();
    await updateBotStatus();
  }

  return (
    <div>
      <div>Bot status: {botStatus}</div>
      <div>
        {botStatus === "On" ? (
          <button onClick={stopBot} className="hover:text-sky-400 text-sky-600">
            Stop bot
          </button>
        ) : (
          <button
            onClick={startBot}
            className="hover:text-sky-400 text-sky-600"
          >
            Start bot
          </button>
        )}
      </div>
    </div>
  );
}
