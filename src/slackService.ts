/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */

interface GetDisplayNameResponse {
  ok: boolean;
  profile: {
    display_name: string;
  };
}

class SlackService {
  private baseUrl = "https://slack.com/api";

  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  getDisplayName(): string {
    const path = "/users.profile.get";

    const payload = {
      token: this.token,
    };

    const response = UrlFetchApp.fetch(this.baseUrl + path, { method: "get", payload });
    Logger.log(`${path}\n${response}`);
    const parsedResult: GetDisplayNameResponse = JSON.parse(response.getContentText());

    return parsedResult.profile.display_name;
  }

  setDisplayName(displayName: string): void {
    const path = "/users.profile.set";

    const payload = {
      token: this.token,
      profile: JSON.stringify({
        display_name: displayName,
      }),
    };

    const response = UrlFetchApp.fetch(this.baseUrl + path, { method: "post", payload });
    Logger.log(`${path}\n${response}`);
  }
}
export default SlackService;
