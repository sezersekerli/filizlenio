import { FilizlenApiClient } from "@filizlen/api-client";
import { getAccessToken } from "./session";
import { getApiBaseUrl } from "./constants";

export const api = new FilizlenApiClient({
  baseUrl: getApiBaseUrl(),
  getAccessToken,
});
