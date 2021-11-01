/* eslint-disable import/extensions */
/* eslint-disable no-undef */

import { OriginalUtilities } from "./originalUtilities";

const WORK_HOURS_WITH_BREAK_TIME = 9;

interface Calendars {
  [calendarId: string]: {
    busy: {
      start: string;
      end: string;
    }[];
  };
}
interface DateFreeHour {
  date: string;
  freeHour: number;
}

export namespace CalendarService {
  export const getDateFreeHours = (timeMinDate: Date, timeMaxDate: Date, calendarId: string): DateFreeHour[] => {
    const freeBusyResponse = Calendar.Freebusy?.query({
      timeMin: timeMinDate.toISOString(),
      timeMax: timeMaxDate.toISOString(),
      timeZone: "Asia/Tokyo",
      items: [{ id: calendarId }],
    });
    if (!freeBusyResponse || !freeBusyResponse.calendars) return [];

    const calendars = freeBusyResponse.calendars as Calendars;
    const busies = calendars[calendarId].busy;

    const dateFreeHours: DateFreeHour[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(timeMinDate.getTime() + OriginalUtilities.dayToMilliseconds(i));
      const dateText = Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd");
      const busiesOfTheDay = busies.filter((busy) => busy.start.includes(dateText));
      const busyHourArray = busiesOfTheDay.map((busy) => {
        const start = new Date(busy.start);
        const end = new Date(busy.end);
        const diffHour = (end.getTime() - start.getTime()) / 1000 / 60 / 60;

        return diffHour;
      });

      const busyHour = busyHourArray.length === 0 ? 0 : busyHourArray.reduce((prev, current) => prev + current);

      dateFreeHours.push({ date: dateText, freeHour: WORK_HOURS_WITH_BREAK_TIME - busyHour });
    }

    return dateFreeHours;
  };

  export const convertDateFreeHoursToText = (dateFreeHours: DateFreeHour[]): string => {
    let text = "直近１週間の作業時間\n";
    dateFreeHours.forEach((dateFreeHour) => {
      const hourText = dateFreeHour.freeHour === WORK_HOURS_WITH_BREAK_TIME ? "🛌" : `\`${dateFreeHour.freeHour}\``;
      text += `${dateFreeHour.date}: ${hourText}\n`;
    });
    return text;
  };
}
