"use client";

import { Event } from "@/src/lib/models/Event";
import { updateEventAction } from "@/src/lib/actions/eventsActions";
import { useEffect, useState } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { getThemesAction } from "@/src/lib/actions/themesActions";
import Link from "next/link";
import { Theme } from "@/src/lib/models/Theme";
import clsx from "clsx";

export default function EditEvent({ event }: { event: Event }) {
  const [eventFormData, setEventFormData] = useState<Event>(event);
  const [themeCreateMode, setThemeCreateMode] = useState<boolean>(false);
  const [themeFormData, setThemeFormData] = useState<Theme>({
    id: 0,
    name: "",
    start: "",
    finish: "",
    pawn: "",
  });
  const [themes, setThemes] = useState<Theme[]>();
  const [resultMessage, setResultMessages] = useState<{
    success: Boolean;
    message: string;
  }>();

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setThemeFormData({ ...themeFormData, [name]: value });
  };

  function setCreateThemeMode(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    createEvent: boolean
  ): void {
    event.preventDefault();
    setThemeCreateMode(createEvent);
  }

  useEffect(() => {
    getThemesAction().then((themes) => setThemes(themes));
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value, type } = event.target;

    if (name === "finished") {
      setEventFormData({
        ...eventFormData,
        [name]: value.toLowerCase() === "true",
      });

      return;
    }

    if (name === "endsAt") {
      value = value + "T23:59:59.000Z";
    }

    setEventFormData({
      ...eventFormData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateEventAction(
      eventFormData,
      themeCreateMode ? themeFormData : undefined
    ).then((response) => {
      if (response && !response.success)
        setResultMessages({
          success: false,
          message: response?.errorMessage ?? "something went wrong",
        });
      else setResultMessages({ success: true, message: "Event updated" });
    });
  };

  function dateToDateString(yourDate: Date): string {
    let newDate = new Date(yourDate);
    return newDate.toISOString().split("T")[0];
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex mb-1">
          <label className="block w-48">Id:</label>
          <input
            className="ml-2 p-1 border-2 rounded-lg w-44"
            type="text"
            name="eventName"
            value={eventFormData.id}
            disabled
          />
        </div>
        <div className="flex mb-1">
          <label className="block w-48">Status:</label>
          <select
            className="ml-2 p-1 border-2 rounded-lg w-44"
            name="finished"
            value={eventFormData.finished.toString()}
            onChange={handleChange}
          >
            <option value="true">Finished</option>
            <option value="false">Unfinished</option>
          </select>
        </div>
        <div className="flex mb-1">
          <label className="block w-48">Event Name:</label>
          <input
            className="ml-2 p-1 border-2 rounded-lg w-44"
            type="text"
            name="eventName"
            value={eventFormData.eventName}
            onChange={handleChange}
          />
        </div>
        <div className="flex mb-1">
          <label className="block w-48">Ends at:</label>
          <input
            className="ml-2 p-1 border-2 rounded-lg w-44"
            type="date"
            name="endsAt"
            value={dateToDateString(eventFormData.endsAt ?? new Date())}
            onChange={handleChange}
          />
        </div>
        <div className="flex mb-1">
          <label className="block w-48">Points for Kilometer:</label>
          <input
            className="ml-2 p-1 border-2 rounded-lg w-44"
            type="number"
            name="pointsForKilometer"
            value={eventFormData.pointsForKilometer}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="flex mb-1">
          <label className="block w-48">Points for Hour:</label>
          <input
            className="ml-2 p-1 border-2 rounded-lg w-44"
            type="number"
            name="pointsForHour"
            value={eventFormData.pointsForHour}
            onChange={(event) => handleChange(event)}
          />
        </div>
        <div className="flex mb-1">
          <label className="block w-48">Total Points to Score:</label>
          <input
            className="ml-2 p-1 border-2 rounded-lg w-44"
            type="number"
            name="totalPointsToScore"
            value={eventFormData.totalPointsToScore}
            onChange={(event) => handleChange(event)}
          />
        </div>
        Theme:
        <>
          <div className="w-96 border-2 rounded-lg">
            <div className="w-full flex flex-row">
              <div
                className={clsx("w-full px-2 border-r-2 text-center", {
                  "border-b-0": themeCreateMode,
                  "border-b-2": !themeCreateMode,
                })}
              >
                <button onClick={(event) => setCreateThemeMode(event, true)}>
                  Create new theme
                </button>
              </div>
              <div
                className={clsx("w-full px-2 border-l-0 text-center", {
                  "border-b-0": !themeCreateMode,
                  "border-b-2": themeCreateMode,
                })}
              >
                <button onClick={(event) => setCreateThemeMode(event, false)}>
                  Use existing theme
                </button>
              </div>
            </div>
            <div className="p-2">
              {themeCreateMode ? (
                <div className="flex flex-col">
                  <div className="flex my-1">
                    <label className="block w-full">Theme name:</label>
                    <input
                      className="ml-2 p-1 border-2 rounded-lg"
                      type="text"
                      name="name"
                      value={themeFormData.name}
                      onChange={handleThemeChange}
                    />
                  </div>
                  <div className="flex mb-1">
                    <label className="block w-full">Start emoji:</label>
                    <input
                      className="ml-2 p-1 border-2 rounded-lg"
                      type="text"
                      placeholder=":dog-house:"
                      name="start"
                      value={themeFormData.start}
                      onChange={handleThemeChange}
                    />
                  </div>
                  <div className="flex mb-1">
                    <label className="block w-full">Pawn name:</label>
                    <input
                      className="ml-2 p-1 border-2 rounded-lg"
                      type="text"
                      placeholder=":dog:"
                      name="pawn"
                      value={themeFormData.pawn}
                      onChange={handleThemeChange}
                    />
                  </div>
                  <div className="flex mb-1">
                    <label className="block w-full">Finish emoji:</label>
                    <input
                      className="ml-2 p-1 border-2 rounded-lg"
                      type="text"
                      placeholder=":bone:"
                      name="finish"
                      value={themeFormData.finish}
                      onChange={handleThemeChange}
                    />
                  </div>
                </div>
              ) : themes !== undefined &&
                themes !== null &&
                themes.length > 0 ? (
                <label>
                  <select
                    name="themeId"
                    className="w-full"
                    value={eventFormData.themeId || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select a theme</option>
                    {themes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}: {theme.start} - {theme.pawn} -{" "}
                        {theme.finish}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <>No themes, create any first</>
              )}
            </div>
          </div>
        </>
        <div
          className={clsx("font-bold", {
            "text-rose-600": !resultMessage?.success,
            "text-green-600": resultMessage?.success,
          })}
        >
          {resultMessage?.message}
        </div>
        <div className="flex flex-row place-items-end">
          <div>
            <button
              type="submit"
              className="bg-green-500 w-32 text-white p-2 rounded-lg hover:bg-green-600 mt-4"
            >
              Update event
            </button>
          </div>
          <div>
            <Link
              href="/admin/events"
              className="w-auto p-2 rounded-lg flex items-center"
            >
              <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
              Back
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
