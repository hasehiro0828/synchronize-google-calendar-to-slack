/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */

export interface Token {
  workspaceName: string;
  token: string;
}

interface ScriptProperties {
  calendarId: string;
  baseDisplayName: string;
  tokens: Token[];
  botToken: Token;
  channelId: string;
}

type NullableProperties = {
  [P in keyof ScriptProperties]: ScriptProperties[P] | null;
};

// eslint-disable-next-line no-unused-vars
const setProperties = (): void => {
  const setProperty = (key: keyof ScriptProperties, value: string): void => {
    PropertiesService.getScriptProperties().setProperty(key, value);
    Logger.log(`${key} に ${value} を set しました`);
  };

  setProperty("calendarId", "");
  setProperty("baseDisplayName", "");

  const tokens: Token[] = [
    { workspaceName: "workspaceName", token: "token-token-token-token-token-token-token-token" },
  ];
  setProperty("tokens", JSON.stringify(tokens));

  const botToken: Token = {
    workspaceName: "workspaceName",
    token: "token-token-token-token-token-token-token-token",
  };
  setProperty("botToken", JSON.stringify(botToken));

  setProperty("channelId", "channelId");
};

// eslint-disable-next-line no-unused-vars
const showProperties = (): void => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  Logger.log(properties);
};

// eslint-disable-next-line no-unused-vars
export namespace PropertiesServiceWrapper {
  export const getProperties = (): ScriptProperties | undefined => {
    const getProperty = (key: keyof ScriptProperties): string | null =>
      PropertiesService.getScriptProperties().getProperty(key);

    const tokens = getProperty("tokens");
    const botToken = getProperty("botToken");
    const nullableProperties: NullableProperties = {
      calendarId: getProperty("calendarId"),
      tokens: tokens ? JSON.parse(tokens) : null,
      baseDisplayName: getProperty("baseDisplayName"),
      botToken: botToken ? JSON.parse(botToken) : null,
      channelId: getProperty("channelId"),
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
      tokens: nullableProperties.tokens as Token[],
      baseDisplayName: nullableProperties.baseDisplayName as string,
      botToken: nullableProperties.botToken as Token,
      channelId: nullableProperties.channelId as string,
    };
  };
}
