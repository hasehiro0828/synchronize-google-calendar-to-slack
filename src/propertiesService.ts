/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */

interface ScriptProperties {
  calendarId: string;
  slackToken: string;
  baseDisplayName: string;
}
type NullableProperties = {
  [P in keyof ScriptProperties]: ScriptProperties[P] | null;
};

// eslint-disable-next-line no-unused-vars
const setProperties = (): void => {
  const setProperty = (key: keyof ScriptProperties, value: string): void => {
    PropertiesService.getScriptProperties().setProperty(key, value);
  };

  setProperty("calendarId", "");
  setProperty("slackToken", "");
  setProperty("baseDisplayName", "");
};

// eslint-disable-next-line no-unused-vars
const showProperties = (): void => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  Logger.log(properties);
};

// eslint-disable-next-line no-unused-vars
namespace PropertiesServiceWrapper {
  export const getProperties = (): ScriptProperties | undefined => {
    const getProperty = (key: keyof ScriptProperties): string | null =>
      PropertiesService.getScriptProperties().getProperty(key);

    const nullableProperties: NullableProperties = {
      calendarId: getProperty("calendarId"),
      slackToken: getProperty("slackToken"),
      baseDisplayName: getProperty("baseDisplayName"),
    };

    // eslint-disable-next-line no-restricted-syntax
    const notDefinedProperties = Object.entries(nullableProperties)
      .filter(([, value]) => !value)
      .map(([key]) => {
        Logger.log(`${key} が定義されていません`);
        return key;
      });

    if (notDefinedProperties.length !== 0) return undefined;
    return {
      calendarId: nullableProperties.calendarId as string,
      slackToken: nullableProperties.slackToken as string,
      baseDisplayName: nullableProperties.baseDisplayName as string,
    };
  };
}
