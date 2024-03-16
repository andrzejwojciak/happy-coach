"use client";

import {
  startBotAction,
  stopBotAction,
  getBotStatusAction,
} from "@/src/lib/actions/botActions";
import { useEffect, useState } from "react";

export default function Events() {
  const [botStatus, setBotStatus] = useState("");

  useEffect(() => {
    getBotStatus();
  }, []);

  const startBot = async () => {
    await startBotAction();
    await getBotStatus();
  };

  const stopBot = async () => {
    await stopBotAction();
    await getBotStatus();
  };

  const getBotStatus = async () => {
    const botStatus = await getBotStatusAction();
    setBotStatus(botStatus);
  };

  return (
    <>
      <div className="flex justify-around w-full bg-white">
        <button
          onClick={startBot}
          className="bg-gray-50 border-4 border-sky-500"
        >
          Click to start bot
        </button>
        <button
          onClick={stopBot}
          className="bg-gray-50 border-4 border-sky-500"
        >
          Click to stop bot
        </button>
        <button
          onClick={getBotStatus}
          className="bg-gray-50 border-4 border-sky-500"
        >
          Click to get bot status
        </button>
      </div>
      <div>{botStatus}</div>
    </>
  );
}
