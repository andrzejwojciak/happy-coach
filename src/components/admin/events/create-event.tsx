"use client";

import { Event } from "@/src/lib/models/Event";
import { createEvent, getEvents } from "@/src/lib/actions/eventsActions";
import { useEffect, useState } from "react";
import { Theme } from "@/src/lib/models/Theme";
import { getThemes } from "@/src/lib/actions/themesActions";
import clsx from "clsx";

export default function CreateEventForm() {
  const [eventFormData, setEventFormData] = useState<Event>({
    id: 0,
    channelId: "",
    eventName: "",
    createdAt: new Date(),
    endsAt: new Date(),
    pointsForKilometer: 21,
    pointsForHour: 37,
    totalPointsToScore: 420,
    finished: false,
  });
  const [themeFormData, setThemeFormData] = useState<Theme>({
    id: 0,
    name: "",
    start: "",
    finish: "",
    pawn: "",
  });
  const [errors, setErrors] = useState<string>();
  const [themes, setThemes] = useState<Theme[]>();
  const [themeCreateMode, setThemeCreateMode] = useState<boolean>(false);

  useEffect(() => {
    getThemes().then((themes) => setThemes(themes));
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    isNumber: boolean = false
  ) => {
    const { name, value } = event.target;
    console.log(event.type);

    if (name === "endsAt") {
      const dateValue = new Date(value + " 12:00");
      console.log(dateValue);
      setEventFormData({ ...eventFormData, [name]: dateValue });
    } else {
      setEventFormData({
        ...eventFormData,
        [name]: isNumber ? Number(value) : value,
      });
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setThemeFormData({ ...themeFormData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createEvent(
      eventFormData,
      themeCreateMode ? themeFormData : undefined
    ).then((response) => {
      if (!response.success) setErrors(response.errorMessage);
    });
  };

  function setCreateThemeMode(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    createEvent: boolean
  ): void {
    event.preventDefault();
    setThemeCreateMode(createEvent);
  }

  function dateToIsoString(yourDate: Date): string {
    let newDate = new Date(yourDate);
    return newDate.toISOString().split("T")[0];
  }

  return (
    <div>
      <div className="text-orange-500 font-light">
        Caution: you can use it but be careful - no validation added yet
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <label>
          Event Name:
          <input
            className="ml-2 p-1 border-2 rounded-lg"
            type="text"
            name="eventName"
            value={eventFormData.eventName}
            onChange={handleChange}
          />
        </label>
        <label>
          Ends at:
          <input
            className="ml-2 p-1 border-2 rounded-lg"
            type="date"
            name="endsAt"
            value={dateToIsoString(eventFormData.endsAt ?? new Date())}
            onChange={handleChange}
          />
        </label>
        <label>
          Points for Kilometer:
          <input
            className="ml-2 p-1 border-2 rounded-lg"
            type="number"
            name="pointsForKilometer"
            value={eventFormData.pointsForKilometer}
            onChange={(event) => handleChange(event, true)}
          />
        </label>
        <label>
          Points for Hour:
          <input
            className="ml-2 p-1 border-2 rounded-lg"
            type="number"
            name="pointsForHour"
            value={eventFormData.pointsForHour}
            onChange={(event) => handleChange(event, true)}
          />
        </label>
        <label>
          Total Points to Score:
          <input
            className="ml-2 p-1 border-2 rounded-lg"
            type="number"
            name="totalPointsToScore"
            value={eventFormData.totalPointsToScore}
            onChange={(event) => handleChange(event, true)}
          />
        </label>
        Theme:
        <div className="">
          <div className="flex flex-row">
            <div
              className={clsx("px-2 border-2 border-slate-400", {
                "border-b-0": themeCreateMode,
              })}
            >
              <button onClick={(event) => setCreateThemeMode(event, true)}>
                Create new theme
              </button>
            </div>
            <div
              className={clsx("px-2 border-2 border-l-0 border-slate-400", {
                "border-b-0": !themeCreateMode,
              })}
            >
              <button onClick={(event) => setCreateThemeMode(event, false)}>
                Use existing theme
              </button>
            </div>
          </div>
          {themeCreateMode ? (
            <div className="flex flex-col">
              <label>
                Theme name:
                <input
                  className="ml-2 p-1 border-2 rounded-lg"
                  type="text"
                  name="name"
                  value={themeFormData.name}
                  onChange={handleThemeChange}
                />
              </label>
              <label>
                Start emoji:
                <input
                  className="ml-2 p-1 border-2 rounded-lg"
                  type="text"
                  placeholder=":dog-house:"
                  name="start"
                  value={themeFormData.start}
                  onChange={handleThemeChange}
                />
              </label>
              <label>
                Pawn name:
                <input
                  className="ml-2 p-1 border-2 rounded-lg"
                  type="text"
                  placeholder=":dog:"
                  name="pawn"
                  value={themeFormData.pawn}
                  onChange={handleThemeChange}
                />
              </label>
              <label>
                Finish emoji:
                <input
                  className="ml-2 p-1 border-2 rounded-lg"
                  type="text"
                  placeholder=":bone:"
                  name="finish"
                  value={themeFormData.finish}
                  onChange={handleThemeChange}
                />
              </label>
            </div>
          ) : themes !== undefined && themes !== null && themes.length > 0 ? (
            <label>
              <select
                name="themeId"
                value={eventFormData.themeId || ""}
                onChange={handleChange}
              >
                <option value="">Select a theme</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}: {theme.start} - {theme.pawn} - {theme.finish}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <>No themes, create any first</>
          )}
        </div>
        <div className="text-rose-600 font-bold">{errors}</div>
        <button
          type="submit"
          className="bg-blue-500 w-32 text-white p-2 rounded-lg hover:bg-blue-800 mt-4"
        >
          Create event
        </button>
      </form>
    </div>
  );
}
