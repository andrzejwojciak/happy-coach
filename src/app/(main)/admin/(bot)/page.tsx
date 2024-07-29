"use client";

import MonthlyUserActivitySummary from "@/src/components/admin/bot/monthly-user-activity-summary";
import OverallActivitySummary from "@/src/components/admin/bot/overall-activity-summary";
import ToggleSwitch from "@/src/components/shared/toggle-switch";
import {
  changeBotStatusAction,
  getBotStatusAction,
} from "@/src/lib/actions/botActions";
import { useEffect, useState } from "react";

export default function Bot() {
  const [botStatus, setBotStatus] = useState<boolean>(false);

  useEffect(() => {
    getBotStatusAction().then((status: boolean) => {
      setBotStatus(status);
    });
  }, []);

  async function changeBotStatus() {
    changeBotStatusAction();
    const status = await getBotStatusAction();
    setBotStatus(status);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <div className="flex-1">
        <div className="flex flex-col border-2 border-slate-200 rounded-lg p-4">
          <div className="font-medium text-xl mb-4">Bot settings</div>
          <div className="space-y-3">
            <div className="flex flex-row justify-between">
              <div>
                <div className="font-medium">Enabled</div>
                <div className="text-sm text-slate-500">
                  Turn on or off the bot
                </div>
              </div>
              <div className="content-center">
                <ToggleSwitch onChange={changeBotStatus} checked={botStatus} />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <div className="font-medium">Challenges</div>
                <div className="text-sm text-slate-500">
                  Enables challenges feature
                </div>
              </div>
              <div className="content-center">
                <ToggleSwitch checked={true} disabled={true} />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <div className="font-medium">Be offend</div>
                <div className="text-sm text-slate-500">
                  Says something offensive to people
                </div>
              </div>
              <div className="content-center">
                <ToggleSwitch checked={false} disabled={true} />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <div className="font-medium">Be motivational</div>
                <div className="text-sm text-slate-500">
                  Says something motivating to people
                </div>
              </div>
              <div className="content-center">
                <ToggleSwitch checked={false} disabled={true} />
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>
                <div className="font-medium">AI</div>
                <div className="text-sm text-slate-500">
                  Use AI to generate messages
                </div>
              </div>
              <div className="content-center">
                <ToggleSwitch checked={false} disabled={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col space-y-6">
          <div className="border-2 border-slate-200 rounded-lg p-4">
            <div className="font-medium text-xl mb-4">Total users input</div>
            <OverallActivitySummary />
          </div>
          <div className="border-2 border-slate-200 rounded-lg p-4">
            <div className="font-medium text-xl mb-4">
              Last 12 months user activity
            </div>
            <MonthlyUserActivitySummary />
          </div>
        </div>
      </div>
    </div>
  );
}
