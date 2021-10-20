/* eslint-disable no-undef */

// eslint-disable-next-line import/extensions
import SlackService from "./slackService";

// eslint-disable-next-line no-unused-vars
const main = (): void => {
  const getStatusText = (calendarId: string): string => {
    const now = new Date();

    const calendar = CalendarApp.getCalendarById(calendarId);
    const events = calendar.getEvents(new Date(now.getTime()), new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000));

    const holidayTexts = events
      .filter((event) => event.isAllDayEvent())
      .filter((event) => event.getTitle().includes("休暇"))
      .map((event) => {
        const date = event.getAllDayStartDate();
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

    return holidayTexts.join(", ");
  };

  const properties = PropertiesServiceWrapper.getProperties();
  if (typeof properties === "undefined") return;

  const statusText = getStatusText(properties.calendarId);
  Logger.log(`statusText：${statusText}`);

  const slackService = new SlackService(properties.slackToken);
  slackService.setDisplayName(`${properties.baseDisplayName}（${statusText} 休暇）`);
};
