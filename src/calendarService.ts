/* eslint-disable import/extensions */
/* eslint-disable no-undef */
import Constants from "./constants";
import { OriginalUtilities } from "./originalUtilities";

interface Calendars {
  [calendarId: string]: {
    busy: {
      start: string;
      end: string;
    }[];
  };
}

export namespace CalendarService {
  export const getFreeHours = (date: Date, calendarId: string): number | undefined => {
    const timeMinDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Constants.WORK_START_TIME.hours,
      Constants.WORK_START_TIME.minutes
    );
    const timeMaxDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      Constants.WORK_START_TIME.hours + Constants.WORK_HOURS_WITH_BREAK_TIME,
      Constants.WORK_START_TIME.minutes
    );

    const freeBusyResponse = Calendar.Freebusy?.query({
      timeMin: timeMinDate.toISOString(),
      timeMax: timeMaxDate.toISOString(),
      timeZone: "Asia/Tokyo",
      items: [{ id: calendarId }],
    });
    if (!freeBusyResponse || !freeBusyResponse.calendars) return undefined;

    const calendars = freeBusyResponse.calendars as Calendars;
    const busies = calendars[calendarId].busy;

    const busyHoursArray = busies.map((busy) => {
      const start = new Date(busy.start);
      const end = new Date(busy.end);
      const diffHour = (end.getTime() - start.getTime()) / 1000 / 60 / 60;

      return diffHour;
    });

    const busyHours = busyHoursArray.length === 0 ? 0 : busyHoursArray.reduce((prev, current) => prev + current);

    return Constants.WORK_HOURS_WITH_BREAK_TIME - busyHours;
  };

  export const isHoliday = (freeHours: number): boolean => freeHours === Constants.WORK_HOURS_WITH_BREAK_TIME;

  export const convertFreeHoursToText = (freeHours: number): string =>
    OriginalUtilities.roundNumber(freeHours, 2).toString();
}
