/* eslint-disable import/extensions */
/* eslint-disable no-undef */

import { CalendarService } from "./calendarService";
import { OriginalUtilities } from "./originalUtilities";
import { PropertiesServiceWrapper } from "./propertiesService";
import SlackService from "./slackService";

// eslint-disable-next-line no-unused-vars
const main = (): void => {
  const getHolidays = (calendarId: string): string => {
    const now = new Date();

    const calendar = CalendarApp.getCalendarById(calendarId);
    const events = calendar.getEvents(
      new Date(now.getTime()),
      new Date(now.getTime() + OriginalUtilities.dayToMilliseconds(7))
    );

    const holidays = events
      .filter((event) => event.isAllDayEvent())
      .filter((event) => event.getTitle().includes("休暇"))
      .map((event) => {
        const date = event.getAllDayStartDate();
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

    return holidays.join(", ");
  };

  const properties = PropertiesServiceWrapper.getProperties();
  if (typeof properties === "undefined") return;

  const holidays = getHolidays(properties.calendarId);
  const statusText = holidays !== "" ? `（${holidays} 休暇）` : "";
  Logger.log(`holidays：${statusText}`);

  const slackService = new SlackService(properties.tokens, properties.botToken);
  slackService.setDisplayName(`${properties.baseDisplayName}${statusText}`);
};

// eslint-disable-next-line no-unused-vars
const sendFreeTime = (): void => {
  const getTodayAndOneWeekLater = (): { today: Date; oneWeekLater: Date } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekLater = new Date(today.getTime() + OriginalUtilities.dayToMilliseconds(7));

    return { today, oneWeekLater };
  };

  const properties = PropertiesServiceWrapper.getProperties();
  if (typeof properties === "undefined") return;

  const { today, oneWeekLater } = getTodayAndOneWeekLater();
  const dateFreeHours = CalendarService.getDateFreeHours(today, oneWeekLater, properties.calendarId);

  const text = CalendarService.convertDateFreeHoursToText(dateFreeHours);

  const slackService = new SlackService(properties.tokens, properties.botToken);
  slackService.chatPostMessage(text, properties.channelId);
};
