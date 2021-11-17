/* eslint-disable import/extensions */
/* eslint-disable no-undef */

import { CalendarService } from "./calendarService";
import Constants from "./constants";
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
  const properties = PropertiesServiceWrapper.getProperties();
  if (typeof properties === "undefined") return;

  const slackService = new SlackService(properties.tokens, properties.botToken);

  const now = new Date();
  const todayDay = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  if (todayDay === 0 || todayDay === 6) {
    Logger.log("本日は土日なのでスキップします");
    return;
  }

  const todayFreeHours = CalendarService.getFreeHours(now, properties.calendarId);
  if (typeof todayFreeHours === "undefined") {
    Logger.log("freeBusy の取得に失敗しました");
    return;
  }
  if (todayFreeHours === Constants.WORK_HOURS_WITH_BREAK_TIME) {
    Logger.log("本日は休みなのでスキップします");
    return;
  }

  if (todayDay !== 1) {
    // 月曜日以外
    const freeHoursText = CalendarService.convertFreeHoursToText(todayFreeHours);
    slackService.chatPostMessage(`本日の作業時間: \`${freeHoursText}\``, properties.channelId);
    return;
  }

  let text = "直近１週間の作業時間\n";
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(now.getTime() + OriginalUtilities.dayToMilliseconds(i));
    const freeHours = CalendarService.getFreeHours(date, properties.calendarId);
    if (typeof freeHours === "undefined") {
      Logger.log("freeBusy の取得に失敗しました");
      return;
    }

    const freeHoursText = CalendarService.convertFreeHoursToText(freeHours);
    text += `${Utilities.formatDate(date, "Asia/Tokyo", "yyyy-MM-dd")}: \`${freeHoursText}\`\n`;
  }

  slackService.chatPostMessage(text, properties.channelId);
};
