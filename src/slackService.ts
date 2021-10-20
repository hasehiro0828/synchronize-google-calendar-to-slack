/* eslint-disable import/extensions */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */

import { Token } from "./propertiesService";

interface Profile {
  display_name: string;
}

interface SetDisplayNamePayload {
  token: string;
  profile: string;
}

class SlackService {
  private baseUrl = "https://slack.com/api";

  private tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
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
}
export default SlackService;
