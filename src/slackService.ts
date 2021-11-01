/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */

import { Token } from "./propertiesService";

interface Profile {
  display_name: string;
}

interface BasePayload {
  token: string;
}

interface SetDisplayNamePayload extends BasePayload {
  profile: string;
}

interface ChatPostMessagePayload extends BasePayload {
  channel: string;
  text: string;
}

class SlackService {
  private baseUrl = "https://slack.com/api";

  private tokens: Token[];

  private botToken: Token;

  constructor(tokens: Token[], botToken: Token) {
    this.tokens = tokens;
    this.botToken = botToken;
  }

  setDisplayName(displayName: string): void {
    const path = "/users.profile.set";

    const profile: Profile = { display_name: displayName };

    this.tokens.forEach((token) => {
      const payload: SetDisplayNamePayload = {
        token: token.token,
        profile: JSON.stringify(profile),
      };

      const response = UrlFetchApp.fetch(this.baseUrl + path, { method: "post", payload });
      Logger.log(`${token.workspaceName}：${path}\n${response}`);
    });
  }

  chatPostMessage(text: string, channel: string): void {
    const path = "/chat.postMessage";

    const payload: ChatPostMessagePayload = {
      token: this.botToken.token,
      channel,
      text,
    };

    const response = UrlFetchApp.fetch(this.baseUrl + path, { method: "post", payload });
    Logger.log(`${this.botToken.workspaceName}：${path}\n${response}`);
  }
}
export default SlackService;
